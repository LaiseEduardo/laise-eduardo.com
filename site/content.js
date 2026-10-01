const content = {
  name: 'Laise Eduardo',
  title: 'Principal SDET · Test Architecture · TypeScript · CI/CD · AI',
  location: 'Barcelona, Spain',
  pitch: 'I design test automation that teams trust: fast, readable, and wired into CI from day one.',
  email: 'laise.aeduardo@gmail.com',
  links: {
    github: 'https://github.com/LaiseEduardo',
    linkedin: 'https://www.linkedin.com/in/laisealine/',
  },
  cv: 'cv.pdf',
  revised: '2026-10-01', // last content change; update when editing this file
  proof: [
    { value: '88%+', label: 'test coverage across eleven11 web, mobile and admin', href: 'https://github.com/LaiseEduardo/eleven11' },
    { value: 'Playwright', label: 'TypeScript framework, CI on every push (polar-bear)', href: 'https://github.com/LaiseEduardo/polar-bear' },
    { value: 'AWS + Terraform', label: 'infrastructure as code on eleven11 and 420finder', href: 'https://github.com/LaiseEduardo/eleven11/tree/main/terraform' },
  ],
  about: [
    'I am a software development engineer in test who has been building quality systems since 2014: automation frameworks from scratch, test architecture for distributed systems, and CI/CD pipelines that give developers fast, trustworthy feedback.',
    'My work is TypeScript-first across UI, API and integration testing. At MoonPay I cut pipeline cost and execution time by 40%; at Abcam I led automation across squads and introduced contract testing with Pact and Zod so integration risk shows up before production does.',
    'I work best embedded with developers and tech leads, improving testability and mentoring engineers. Outside client work I ship my own products end to end, infrastructure included, which keeps my opinions about testing honest.',
  ],
  skills: [
    { group: 'Test automation', items: ['Playwright', 'Cypress', 'Jest', 'Supertest', 'WebdriverIO', 'Selenium', 'Protractor', 'Postman'] },
    { group: 'Architecture & quality', items: ['Test strategy', 'Test architecture', 'Contract testing (Pact, Zod)', 'API testing', 'E2E & integration testing', 'Flake reduction', 'Visual testing (OpenCV)'] },
    { group: 'Languages', items: ['TypeScript', 'JavaScript', 'Node.js', 'Python', 'Bash', 'HTML & CSS'] },
    { group: 'CI/CD & cloud', items: ['GitHub Actions', 'GitLab CI', 'CircleCI', 'Docker', 'AWS', 'GCP', 'Vercel', 'Terraform'] },
    { group: 'Ways of working', items: ['Agile, Scrum, Kanban', 'Mentoring & coaching', 'Remote, international teams', 'AI-assisted engineering (Claude Code, MCP, agents)', 'JIRA, Linear, HP ALM'] },
  ],
  experience: [
    { role: 'Senior QA Engineer, acting Principal', company: 'Abcam', period: 'Jul 2024 — Mar 2026', bullets: [
      'Led cross-team automation initiatives, aligning frameworks, quality standards and testing practices across squads.',
      'Introduced contract testing with Pact and Zod to reduce integration risk and stop brittle mocks masking issues.',
      'Made merge-request testing faster and more stable by isolating third-party dependencies and defining test data strategies.',
      'Mentored QA engineers and developers on test strategy, framework adoption and maintainable patterns.',
    ] },
    { role: 'Senior QA Engineer / Senior Full Stack SDET', company: 'MoonPay', period: 'May 2022 — May 2024 · remote', bullets: [
      'Implemented Playwright with TypeScript from scratch and wired it into GitHub Actions and Vercel preview deployments.',
      'Reduced testing pipeline cost and execution time by 40% through CI/CD optimisation and better test architecture.',
      'Built GitHub Actions tooling for dynamic preview URL capture, shortening developer feedback loops.',
    ] },
    { role: 'Senior SDET', company: 'Warner Media', period: 'Jul 2021 — Apr 2022', bullets: [
      'Built a visual automation framework with Python and OpenCV for regression and compatibility testing on Smart TVs and set-top boxes.',
    ] },
    { role: 'Senior SDET / Automation Specialist', company: 'Harlem Next', period: 'Oct 2020 — Jun 2021', bullets: [
      'Developed frontend and backend automation frameworks for distributed systems used across several countries.',
      'Integrated CI pipelines, reporting and load testing (Locust) while coaching teams on automation standards and testability.',
    ] },
    { role: 'Senior SDET', company: 'DAZN', period: 'Mar 2019 — Sep 2020', bullets: [
      'Led test strategy for API, web and TV platforms in a microservices and micro-frontends architecture.',
      'Built automation frameworks, Docker-based pipelines and test reporting for multiplatform delivery.',
    ] },
    { role: 'QA Engineer', company: 'LobsterInk', period: 'Jun 2017 — Dec 2018', bullets: [
      'Built end-to-end regression coverage with Protractor for high-impact product releases.',
    ] },
    { role: 'QA Test Engineer', company: 'Amdocs', period: 'Jan 2016 — Apr 2017', bullets: [
      'Designed and executed backend, mobile, API and end-to-end test cycles for telecom migration projects.',
    ] },
    { role: 'QA Analyst', company: 'Hewlett Packard Enterprise Services', period: 'Jun 2014 — Dec 2015', bullets: [
      'Created requirement traceability matrices and test cases for digital banking applications, supporting manual and Selenium automation.',
    ] },
  ],
  projects: [
    { name: 'eleven11', description: 'Community price comparison for groceries, fuel and pet products. Web, Expo mobile app and admin, 88%+ test coverage across apps.', tags: ['TypeScript', 'React', 'Expo', 'AWS', 'Terraform'], repo: 'https://github.com/LaiseEduardo/eleven11', live: 'https://eleven11finder.com' },
    { name: 'polar-bear', description: 'Clean, maintainable Playwright + TypeScript test automation framework for the RealWorld app, with CI on every push.', tags: ['Playwright', 'TypeScript', 'GitHub Actions'], repo: 'https://github.com/LaiseEduardo/polar-bear', live: null },
    { name: '420finder', description: 'Multi-tenant platform for cannabis clubs: catalog, members, prepaid wallets and in-person orders.', tags: ['TypeScript', 'React', 'AWS', 'Terraform'], repo: 'https://github.com/LaiseEduardo/420finder', live: null },
    { name: 'Zelo', description: 'Family care coordination app that turns WhatsApp chaos into organised caregiving.', tags: ['TypeScript', 'React', 'AWS'], repo: 'https://github.com/LaiseEduardo/zelo-app', live: null },
  ],
};
export default content;
