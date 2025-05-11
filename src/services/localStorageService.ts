
// Types for our application
export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  hasPurchasedCourses?: boolean;
  isDisabled?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorId: string;
  image: string;
  price: number;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  topics: string[];
  rating?: number;
  studentsEnrolled?: number;
  createdAt: string;
  updatedAt: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  duration: string;
  content: string;
  order: number;
}

export interface ForumTopic {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
  courseId?: string;
  replies: ForumReply[];
  tags: string[];
  views: number;
}

export interface ForumReply {
  id: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
  topicId: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  dueDate: string;
  createdAt: string;
  submissions: AssignmentSubmission[];
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  content: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "video" | "link" | "other";
  url: string;
  courseId?: string;
  createdAt: string;
  addedBy: string;
  addedById: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId: string;
  questions: QuizQuestion[];
  timeLimit?: number;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
}

// Initial default data
const initialUsers: User[] = [
  {
    id: "user-admin",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin"
  },
  {
    id: "user-teacher",
    name: "Teacher User",
    email: "teacher@example.com",
    role: "teacher"
  },
  {
    id: "user-student",
    name: "Student User",
    email: "student@example.com",
    role: "student",
    hasPurchasedCourses: true
  }
];

const initialCourses: Course[] = [
  {
    id: "course-1",
    title: "Web Development Fundamentals",
    description: "Learn the basics of web development, including HTML, CSS, and JavaScript.",
    instructor: "Teacher User",
    instructorId: "user-teacher",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 49.99,
    duration: "8 weeks",
    level: "beginner",
    topics: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    rating: 4.7,
    studentsEnrolled: 1254,
    createdAt: "2023-01-15T10:00:00Z",
    updatedAt: "2023-01-15T10:00:00Z",
    lessons: [
      {
        id: "lesson-1-1",
        courseId: "course-1",
        title: "Introduction to HTML",
        duration: "45 minutes",
        content: "In this lesson, you'll learn the basics of HTML...",
        order: 1
      },
      {
        id: "lesson-1-2",
        courseId: "course-1",
        title: "CSS Layouts and Responsive Design",
        duration: "60 minutes",
        content: "Learn how to create responsive layouts with CSS...",
        order: 2
      }
    ]
  },
  {
    id: "course-2",
    title: "Data Science and Machine Learning",
    description: "Introduction to data science, Python, and machine learning algorithms.",
    instructor: "Teacher User",
    instructorId: "user-teacher",
    image: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 69.99,
    duration: "10 weeks",
    level: "intermediate",
    topics: ["Python", "Data Analysis", "Machine Learning", "Pandas", "NumPy"],
    rating: 4.8,
    studentsEnrolled: 872,
    createdAt: "2023-02-20T14:30:00Z",
    updatedAt: "2023-02-20T14:30:00Z",
    lessons: [
      {
        id: "lesson-2-1",
        courseId: "course-2",
        title: "Introduction to Python for Data Science",
        duration: "50 minutes",
        content: "Get started with Python programming for data analysis...",
        order: 1
      },
      {
        id: "lesson-2-2",
        courseId: "course-2",
        title: "Introduction to Neural Networks",
        duration: "65 minutes",
        content: "Learn the fundamentals of neural networks and deep learning...",
        order: 2
      }
    ]
  }
];

const initialForumTopics: ForumTopic[] = [
  {
    id: "topic-1",
    title: "How to implement responsive design in React?",
    content: "I'm having trouble making my React components responsive. Any tips or best practices?",
    author: "Student User",
    authorId: "user-student",
    createdAt: "2023-05-10T08:45:00Z",
    courseId: "course-1",
    replies: [
      {
        id: "reply-1-1",
        content: "Try using media queries in your CSS or a responsive framework like Tailwind CSS.",
        author: "Teacher User",
        authorId: "user-teacher",
        createdAt: "2023-05-10T09:30:00Z",
        topicId: "topic-1"
      }
    ],
    tags: ["React", "CSS", "Responsive Design"],
    views: 42
  },
  {
    id: "topic-2",
    title: "Best practices for Python data visualization?",
    content: "What are the best libraries and approaches for data visualization in Python?",
    author: "Student User",
    authorId: "user-student",
    createdAt: "2023-05-12T14:20:00Z",
    courseId: "course-2",
    replies: [],
    tags: ["Python", "Data Visualization", "Matplotlib", "Seaborn"],
    views: 28
  }
];

const initialAssignments: Assignment[] = [
  {
    id: "assignment-1",
    title: "Portfolio Project - Phase 1",
    description: "Create a simple portfolio website using HTML and CSS.",
    courseId: "course-1",
    dueDate: "2023-05-15T23:59:59Z",
    createdAt: "2023-05-01T10:00:00Z",
    submissions: []
  },
  {
    id: "assignment-2",
    title: "Data Visualization Project",
    description: "Analyze a dataset and create meaningful visualizations using Python.",
    courseId: "course-2",
    dueDate: "2023-05-18T23:59:59Z",
    createdAt: "2023-05-02T14:30:00Z",
    submissions: []
  }
];

const initialResources: Resource[] = [
  {
    id: "resource-1",
    title: "HTML5 Cheat Sheet",
    description: "A quick reference guide for HTML5 elements and attributes.",
    type: "pdf",
    url: "https://example.com/html5-cheatsheet.pdf",
    courseId: "course-1",
    createdAt: "2023-05-03T09:15:00Z",
    addedBy: "Teacher User",
    addedById: "user-teacher"
  },
  {
    id: "resource-2",
    title: "Python Data Science Handbook",
    description: "Comprehensive guide to Python data analysis tools.",
    type: "link",
    url: "https://jakevdp.github.io/PythonDataScienceHandbook/",
    courseId: "course-2",
    createdAt: "2023-05-04T11:45:00Z",
    addedBy: "Teacher User",
    addedById: "user-teacher"
  }
];

const initialQuizzes: Quiz[] = [
  {
    id: "quiz-1",
    title: "HTML Fundamentals Quiz",
    description: "Test your knowledge of HTML basics",
    courseId: "course-1",
    questions: [
      {
        id: "question-1-1",
        question: "What does HTML stand for?",
        options: [
          "Hypertext Markup Language",
          "Hypertext Markdown Language",
          "Hypertext Transfer Protocol",
          "Hyper Transfer Markup Language"
        ],
        correctOption: 0
      }
    ],
    timeLimit: 10,
    createdAt: "2023-05-05T15:30:00Z"
  }
];

// LocalStorage service
class LocalStorageService {
  // Initialize localStorage with default data if empty
  initialize() {
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify(initialUsers));
    }
    if (!localStorage.getItem('courses')) {
      localStorage.setItem('courses', JSON.stringify(initialCourses));
    }
    if (!localStorage.getItem('forumTopics')) {
      localStorage.setItem('forumTopics', JSON.stringify(initialForumTopics));
    }
    if (!localStorage.getItem('assignments')) {
      localStorage.setItem('assignments', JSON.stringify(initialAssignments));
    }
    if (!localStorage.getItem('resources')) {
      localStorage.setItem('resources', JSON.stringify(initialResources));
    }
    if (!localStorage.getItem('quizzes')) {
      localStorage.setItem('quizzes', JSON.stringify(initialQuizzes));
    }
  }

  // User methods
  getUsers(): User[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  getUserById(id: string): User | undefined {
    const users = this.getUsers();
    return users.find(user => user.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    const users = this.getUsers();
    return users.find(user => user.email === email);
  }

  addUser(user: User): User {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    return user;
  }

  updateUser(updatedUser: User): User {
    const users = this.getUsers();
    const index = users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
    return updatedUser;
  }

  deleteUser(id: string): boolean {
    const users = this.getUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    if (filteredUsers.length < users.length) {
      localStorage.setItem('users', JSON.stringify(filteredUsers));
      return true;
    }
    return false;
  }

  // Course methods
  getCourses(): Course[] {
    const courses = localStorage.getItem('courses');
    return courses ? JSON.parse(courses) : [];
  }

  getCourseById(id: string): Course | undefined {
    const courses = this.getCourses();
    return courses.find(course => course.id === id);
  }

  getCoursesByInstructor(instructorId: string): Course[] {
    const courses = this.getCourses();
    return courses.filter(course => course.instructorId === instructorId);
  }

  addCourse(course: Course): Course {
    const courses = this.getCourses();
    courses.push(course);
    localStorage.setItem('courses', JSON.stringify(courses));
    return course;
  }

  updateCourse(updatedCourse: Course): Course {
    const courses = this.getCourses();
    const index = courses.findIndex(course => course.id === updatedCourse.id);
    if (index !== -1) {
      courses[index] = updatedCourse;
      localStorage.setItem('courses', JSON.stringify(courses));
    }
    return updatedCourse;
  }

  deleteCourse(id: string): boolean {
    const courses = this.getCourses();
    const filteredCourses = courses.filter(course => course.id !== id);
    if (filteredCourses.length < courses.length) {
      localStorage.setItem('courses', JSON.stringify(filteredCourses));
      return true;
    }
    return false;
  }

  // Forum methods
  getForumTopics(): ForumTopic[] {
    const topics = localStorage.getItem('forumTopics');
    return topics ? JSON.parse(topics) : [];
  }

  getForumTopicById(id: string): ForumTopic | undefined {
    const topics = this.getForumTopics();
    return topics.find(topic => topic.id === id);
  }

  getForumTopicsByCourse(courseId: string): ForumTopic[] {
    const topics = this.getForumTopics();
    return topics.filter(topic => topic.courseId === courseId);
  }

  addForumTopic(topic: ForumTopic): ForumTopic {
    const topics = this.getForumTopics();
    topics.push(topic);
    localStorage.setItem('forumTopics', JSON.stringify(topics));
    return topic;
  }

  updateForumTopic(updatedTopic: ForumTopic): ForumTopic {
    const topics = this.getForumTopics();
    const index = topics.findIndex(topic => topic.id === updatedTopic.id);
    if (index !== -1) {
      topics[index] = updatedTopic;
      localStorage.setItem('forumTopics', JSON.stringify(topics));
    }
    return updatedTopic;
  }

  deleteForumTopic(id: string): boolean {
    const topics = this.getForumTopics();
    const filteredTopics = topics.filter(topic => topic.id !== id);
    if (filteredTopics.length < topics.length) {
      localStorage.setItem('forumTopics', JSON.stringify(filteredTopics));
      return true;
    }
    return false;
  }

  addForumReply(topicId: string, reply: ForumReply): ForumReply {
    const topics = this.getForumTopics();
    const index = topics.findIndex(topic => topic.id === topicId);
    if (index !== -1) {
      if (!topics[index].replies) {
        topics[index].replies = [];
      }
      topics[index].replies.push(reply);
      localStorage.setItem('forumTopics', JSON.stringify(topics));
    }
    return reply;
  }

  // Assignment methods
  getAssignments(): Assignment[] {
    const assignments = localStorage.getItem('assignments');
    return assignments ? JSON.parse(assignments) : [];
  }

  getAssignmentById(id: string): Assignment | undefined {
    const assignments = this.getAssignments();
    return assignments.find(assignment => assignment.id === id);
  }

  getAssignmentsByCourse(courseId: string): Assignment[] {
    const assignments = this.getAssignments();
    return assignments.filter(assignment => assignment.courseId === courseId);
  }

  addAssignment(assignment: Assignment): Assignment {
    const assignments = this.getAssignments();
    assignments.push(assignment);
    localStorage.setItem('assignments', JSON.stringify(assignments));
    return assignment;
  }

  updateAssignment(updatedAssignment: Assignment): Assignment {
    const assignments = this.getAssignments();
    const index = assignments.findIndex(assignment => assignment.id === updatedAssignment.id);
    if (index !== -1) {
      assignments[index] = updatedAssignment;
      localStorage.setItem('assignments', JSON.stringify(assignments));
    }
    return updatedAssignment;
  }

  deleteAssignment(id: string): boolean {
    const assignments = this.getAssignments();
    const filteredAssignments = assignments.filter(assignment => assignment.id !== id);
    if (filteredAssignments.length < assignments.length) {
      localStorage.setItem('assignments', JSON.stringify(filteredAssignments));
      return true;
    }
    return false;
  }

  // Assignment submission methods
  addSubmission(assignmentId: string, submission: AssignmentSubmission): AssignmentSubmission {
    const assignments = this.getAssignments();
    const index = assignments.findIndex(assignment => assignment.id === assignmentId);
    if (index !== -1) {
      if (!assignments[index].submissions) {
        assignments[index].submissions = [];
      }
      assignments[index].submissions.push(submission);
      localStorage.setItem('assignments', JSON.stringify(assignments));
    }
    return submission;
  }

  updateSubmission(assignmentId: string, updatedSubmission: AssignmentSubmission): AssignmentSubmission {
    const assignments = this.getAssignments();
    const assignmentIndex = assignments.findIndex(assignment => assignment.id === assignmentId);
    if (assignmentIndex !== -1 && assignments[assignmentIndex].submissions) {
      const submissionIndex = assignments[assignmentIndex].submissions.findIndex(
        submission => submission.id === updatedSubmission.id
      );
      if (submissionIndex !== -1) {
        assignments[assignmentIndex].submissions[submissionIndex] = updatedSubmission;
        localStorage.setItem('assignments', JSON.stringify(assignments));
      }
    }
    return updatedSubmission;
  }

  // Resource methods
  getResources(): Resource[] {
    const resources = localStorage.getItem('resources');
    return resources ? JSON.parse(resources) : [];
  }

  getResourceById(id: string): Resource | undefined {
    const resources = this.getResources();
    return resources.find(resource => resource.id === id);
  }

  getResourcesByCourse(courseId: string): Resource[] {
    const resources = this.getResources();
    return resources.filter(resource => resource.courseId === courseId);
  }

  addResource(resource: Resource): Resource {
    const resources = this.getResources();
    resources.push(resource);
    localStorage.setItem('resources', JSON.stringify(resources));
    return resource;
  }

  updateResource(updatedResource: Resource): Resource {
    const resources = this.getResources();
    const index = resources.findIndex(resource => resource.id === updatedResource.id);
    if (index !== -1) {
      resources[index] = updatedResource;
      localStorage.setItem('resources', JSON.stringify(resources));
    }
    return updatedResource;
  }

  deleteResource(id: string): boolean {
    const resources = this.getResources();
    const filteredResources = resources.filter(resource => resource.id !== id);
    if (filteredResources.length < resources.length) {
      localStorage.setItem('resources', JSON.stringify(filteredResources));
      return true;
    }
    return false;
  }

  // Quiz methods
  getQuizzes(): Quiz[] {
    const quizzes = localStorage.getItem('quizzes');
    return quizzes ? JSON.parse(quizzes) : [];
  }

  getQuizById(id: string): Quiz | undefined {
    const quizzes = this.getQuizzes();
    return quizzes.find(quiz => quiz.id === id);
  }

  getQuizzesByCourse(courseId: string): Quiz[] {
    const quizzes = this.getQuizzes();
    return quizzes.filter(quiz => quiz.courseId === courseId);
  }

  addQuiz(quiz: Quiz): Quiz {
    const quizzes = this.getQuizzes();
    quizzes.push(quiz);
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    return quiz;
  }

  updateQuiz(updatedQuiz: Quiz): Quiz {
    const quizzes = this.getQuizzes();
    const index = quizzes.findIndex(quiz => quiz.id === updatedQuiz.id);
    if (index !== -1) {
      quizzes[index] = updatedQuiz;
      localStorage.setItem('quizzes', JSON.stringify(quizzes));
    }
    return updatedQuiz;
  }

  deleteQuiz(id: string): boolean {
    const quizzes = this.getQuizzes();
    const filteredQuizzes = quizzes.filter(quiz => quiz.id !== id);
    if (filteredQuizzes.length < quizzes.length) {
      localStorage.setItem('quizzes', JSON.stringify(filteredQuizzes));
      return true;
    }
    return false;
  }
}

export const localStorageService = new LocalStorageService();

// Initialize localStorage on first import
localStorageService.initialize();
