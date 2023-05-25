const { Course } = require('models/courses')
const { Chapter } = require('models/chapters')

const checkIsOwned = async (req, res, next) => {
  const { courseid } = req.params
  const { userId } = req
  const course = await Course.findByPk(courseid)

  if (!course) {
    return res.status(403).json({ status: false, message: '找不到對應課程' })
  }

  if (course.teacherId !== userId) {
    return res.status(403).json({ status: false, message: '你沒有權限獲取此課程資料' })
  }

  next()
}

const checkCourseExist = async (req, res, next) => {
  const { courseid } = req.params
  const course = await Course.findByPk(courseid)

  if (!course) {
    return res.status(403).json({ status: false, message: '所選的課程不存在' })
  }

  next()
}

const checkChapterInCourse = async (req, res, next) => {
  const { courseid, chapterid } = req.params

  const course = await Course.findByPk(courseid)

  const result = await course.hasChapter(chapterid, {
    where: { courseId: courseid }
  })

  if (!result) {
    return res.status(403).json({ status: false, message: '此課程下無此章節' })
  }

  next()
}

const checkLessonInChapter = async (req, res, next) => {
  const { chapterid, lessonid } = req.params

  const chapter = await Chapter.findByPk(chapterid)

  const result = await chapter.hasLesson(lessonid, {
    where: { chapterId: chapterid }
  })

  if (!result) {
    return res.status(403).json({ status: false, message: '此章節下無此單元' })
  }

  next()
}

module.exports = {
  checkIsOwned,
  checkCourseExist,
  checkChapterInCourse,
  checkLessonInChapter
}
