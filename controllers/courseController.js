const { Course } = require('../models/courses')
const { Chapter } = require('../models/chapters')
const { Lesson } = require('../models/lessons')
const { errorTemplateFun } = require('../src/utils/template')

exports.course = {
  get: async (req, res) => {
    try {
      const courseId = req.params.courseid

      const courseData = await Course.findOne({
        where: { id: courseId }
      })
      if (!courseData) {
        return res.status(404).json({ message: '課程不存在' })
      }

      // 取得該課程的章節資訊
      const chapters = await Chapter.findAll({
        where: { courseId },
        attributes: ['id', 'title'],
        include: [
          {
            model: Lesson,
            attributes: ['id', 'title']
          }
        ]
      })

      const responseData = {
        course: courseData,
        chapters: chapters.map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          lessons: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title
          }))
        }))
      }

      res.json({
        status: true,
        message: '取完課程成功',
        data: responseData
      })
    } catch (error) {
      console.log(error)
      errorTemplateFun(error)
    }
  }
}

exports.chapters = {
  get: async (req, res) => {
    try {
      const { courseid } = req.params

      const courses = [] // 儲存課程資料的陣列

      // 取得課程資訊
      const courseData = await Course.findAll()

      // 迭代每個課程資料
      for (const course of courseData) {
        const chapters = [] // 儲存章節資料的陣列

        // 取得該課程的章節資訊
        const chapterData = await Chapter.findAll({
          where: { courseid: course.id }
        })

        // 迭代每個章節資料
        for (const chapter of chapterData) {
          const lessons = [] // 儲存教學單元資料的陣列

          // 取得該章節的教學單元資訊
          const lessonData = await Lesson.findAll({
            where: { chapterId: chapter.id }
          })

          // 迭代每個教學單元資料
          for (const lesson of lessonData) {
            // 建立教學單元物件，包含教學單元的 ID 和標題
            const lessonObject = {
              id: lesson.id,
              title: lesson.title
            }

            // 將教學單元物件加入教學單元資料的陣列
            lessons.push(lessonObject)
          }

          // 建立章節物件，包含章節的 ID、標題和教學單元資
          const chapterObject = {
            id: chapter.id,
            title: chapter.title,
            lessons: lessons
          }

          // 將章節物件加入章節資料的陣列
          chapters.push(chapterObject)
        }

        // 建立課程物件，包含課程的 ID、標題和章節資料
        const courseObject = {
          id: course.id,
          title: course.title,
          chapters: chapters
        }

        // 將課程物件加入課程資料的陣列
        courses.push(courseObject)
      }

      res.json({
        status: true,
        data: courses
      })
    } catch (error) {
      console.log(error)
      errorTemplateFun(error)
    }
  }
}
