const content = {
  name: 'Laise Eduardo',
  title: 'Software Developer in Test · Test Automation Architect',
  location: 'Barcelona, Spain',
  pitch: 'I design test automation that teams trust: fast, readable, and wired into CI from day one.',
  email: 'laise.aeduardo@gmail.com',
  links: {
    github: 'https://github.com/LaiseEduardo',
    linkedin: 'https://www.linkedin.com/in/laise-eduardo', // TODO confirm
  },
  cv: null, // set to 'cv.pdf' when the PDF is added to site/
  about: [
    'TODO — paragraph 1 from CV.',
    'TODO — paragraph 2 from CV.',
  ],
  skills: [
    { group: 'Test automation', items: ['Playwright', 'TypeScript', 'E2E & API testing', 'Test architecture', 'Page objects'] },
    { group: 'CI/CD & cloud', items: ['GitHub Actions', 'AWS (S3, CloudFront, Lambda)', 'Terraform', 'Cloudflare'] },
    { group: 'Engineering', items: ['Node.js', 'React', 'React Native / Expo', 'PostgreSQL', 'REST APIs'] },
  ],
  experience: [
    { role: 'TODO role', company: 'TODO company', period: 'TODO 2024 — present', bullets: ['TODO achievement 1', 'TODO achievement 2'] },
  ],
  projects: [
    { name: 'polar-bear', description: 'Clean, maintainable Playwright + TypeScript test automation framework for the RealWorld app, with CI on every push.', tags: ['Playwright', 'TypeScript', 'GitHub Actions'], repo: 'https://github.com/LaiseEduardo/polar-bear', live: null },
    { name: 'eleven11', description: 'Community price comparison for groceries, fuel and pet products. Web, Expo mobile app and admin, 88%+ test coverage across apps.', tags: ['TypeScript', 'React', 'Expo', 'AWS', 'Terraform'], repo: 'https://github.com/LaiseEduardo/eleven11', live: 'https://eleven11finder.com' },
    { name: '420finder', description: 'Multi-tenant platform for cannabis clubs: catalog, members, prepaid wallets and in-person orders.', tags: ['TypeScript', 'React', 'AWS', 'Terraform'], repo: 'https://github.com/LaiseEduardo/420finder', live: null },
    { name: 'Zelo', description: 'Family care coordination app that turns WhatsApp chaos into organised caregiving.', tags: ['TypeScript', 'React', 'AWS'], repo: 'https://github.com/LaiseEduardo/zelo-app', live: null },
  ],
};
export default content;
