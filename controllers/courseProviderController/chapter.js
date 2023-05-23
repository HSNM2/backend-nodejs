const { Course } = require('models/courses')
const { Chapter } = require('models/chapters')
const { Lesson } = require('models/lessons')
const { checkChapterExist } = require('../../src/utils/template')

module.exports = {
  get: async (req, res) => {
    try {
      const { courseid } = req.params

      const chapters = await Chapter.findAll({
        where: { courseId: courseid },
        attributes: ['id', 'title'],
        include: [
          {
            model: Lesson,
            attributes: ['id', 'title']
          }
        ]
      })

      res.json({
        status: true,
        message: chapters
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  post: async (req, res) => {
    try {
      const { courseid } = req.params

      const course = await Course.findByPk(courseid)

      const { title } = req.body

      const result = course.createChapter({
        title
      })

      if (result) {
        res.json({
          status: true,
          message: '建立章節成功'
        })
      }
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  patch: async (req, res) => {
    try {
      const { chapterid } = req.params
      const { title } = req.body

      const chapter = await Chapter.findByPk(chapterid)
      checkChapterExist(chapter)

      const result = await Chapter.update(
        {
          title
        },
        {
          where: {
            id: chapterid
          }
        }
      )

      if (result) {
        res.json({
          status: true,
          message: '章節修改成功'
        })
      }
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  delete: async (req, res) => {
    try {
      const { chapterid } = req.params
      const chapter = await Chapter.findByPk(chapterid)
      checkChapterExist(chapter)

      const result = await Chapter.destroy({
        where: {
          id: chapterid
        }
      })

      if (result) {
        res.json({
          status: true,
          message: '章節刪除成功'
        })
      }
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  }
}
