const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const { Sequelize, DataTypes } = require('sequelize')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use(limiter)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Database setup
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
  dialectOptions: process.env.NODE_ENV === 'production' ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {}
})

// Models
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'editor', 'viewer'),
    defaultValue: 'viewer'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
})

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  technologies: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  demo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  github: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
})

const Experience = sequelize.define('Experience', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false
  },
  period: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  skills: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
})

const Skill = sequelize.define('Skill', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('design', 'development', 'tools'),
    allowNull: false
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    validate: {
      min: 1,
      max: 10
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
})

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('unread', 'read', 'replied'),
    defaultValue: 'unread'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
})

// Associations
User.hasMany(Project, { foreignKey: 'createdBy' })
Project.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' })

User.hasMany(Experience, { foreignKey: 'createdBy' })
Experience.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' })

User.hasMany(Skill, { foreignKey: 'createdBy' })
Skill.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' })

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' })
    }
    req.user = user
    next()
  })
}

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Permisos insuficientes' })
    }
    next()
  }
}

// Routes
// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email, isActive: true } })
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
})

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role']
    })
    res.json(user)
  } catch (error) {
    console.error('Error obteniendo usuario:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
})

// Projects routes
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { isActive: true },
      order: [['order', 'ASC'], ['createdAt', 'DESC']],
      include: [{ model: User, as: 'creator', attributes: ['name'] }]
    })
    res.json(projects)
  } catch (error) {
    console.error('Error obteniendo proyectos:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
})

app.post('/api/projects', authenticateToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { title, description, technologies, image, demo, github, order } = req.body
    
    const project = await Project.create({
      title,
      description,
      technologies: technologies || [],
      image,
      demo,
      github,
      order: order || 0,
      createdBy: req.user.id
    })

    res.status(201).json(project)
  } catch (error) {
    console.error('Error creando proyecto:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
})

app.put('/api/projects/:id', authenticateToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, technologies, image, demo, github, order } = req.body

    const project = await Project.findByPk(id)
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' })
    }

    await project.update({
      title,
      description,
      technologies: technologies || [],
      image,
      demo,
      github,
      order: order || 0
    })

    res.json(project)
  } catch (error) {
    console.error('Error actualizando proyecto:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
})

app.delete('/api/projects/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params
    
    const project = await Project.findByPk(id)
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' })
    }

    await project.update({ isActive: false })
    res.json({ message: 'Proyecto eliminado exitosamente' })
  } catch (error) {
    console.error('Error eliminando proyecto:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
})

// Experience routes
app.get('/api/experience', async (req, res) => {
  try {
    const experiences = await Experience.findAll({
      where: { isActive: true },
      order: [['order', 'ASC'], ['createdAt', 'DESC']],
      include: [{ model: User, as: 'creator', attributes: ['name'] }]
    })
    res.json(experiences)
  } catch (error) {
    console.error('Error obteniendo experiencias:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
})

app.post('/api/experience', authenticateToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { title, company, period, description, skills, order } = req.body
    
    const experience = await Experience.create({
      title,
      company,
      period,
      description,
      skills,
      order: order || 0,
      createdBy: req.user.id
    })

    res.status(201).json(experience)
  } catch (error) {
    console.error('Error creando experiencia:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
})

// Skills routes
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await Skill.findAll({
      where: { isActive: true },
      order: [['category', 'ASC'], ['name', 'ASC']]
    })
    res.json(skills)
  } catch (error) {
    console.error('Error obteniendo habilidades:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
})

// Contacts routes
app.get('/api/contacts', authenticateToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const contacts = await Contact.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    })
    res.json(contacts)
  } catch (error) {
    console.error('Error obteniendo contactos:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
})

app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, message } = req.body
    
    const contact = await Contact.create({
      name,
      email,
      message
    })

    res.status(201).json(contact)
  } catch (error) {
    console.error('Error creando contacto:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
})

// Dashboard stats
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const [projectsCount, experienceCount, contactsCount, usersCount] = await Promise.all([
      Project.count({ where: { isActive: true } }),
      Experience.count({ where: { isActive: true } }),
      Contact.count({ where: { isActive: true } }),
      User.count({ where: { isActive: true } })
    ])

    res.json({
      projects: projectsCount,
      experience: experienceCount,
      contacts: contactsCount,
      users: usersCount
    })
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Start server
const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Conectado a la base de datos')
    
    await sequelize.sync({ force: false })
    console.log('✅ Modelos sincronizados')

    // Create default admin user if not exists
    const adminExists = await User.findOne({ where: { email: process.env.ADMIN_EMAIL } })
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
      await User.create({
        name: 'Administrador',
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin'
      })
      console.log('✅ Usuario administrador creado')
    }

    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend corriendo en puerto ${PORT}`)
    })
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error)
    process.exit(1)
  }
}

startServer()