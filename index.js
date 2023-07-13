const puppeteer = require("puppeteer");
const fs = require("fs");
const readline = require("readline");

(async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  async function getUserName() {
    return new Promise((resolve) => {
      rl.question("Please enter a username: ", (userName) => {
        resolve(userName);
        rl.close();
      });
    });
  }
  const userName = await getUserName();

  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();

  await page.goto("https://www.linkedin.com/");

  await page.waitForSelector('[autocomplete="username"]');
  await page.waitForSelector('[autocomplete="current-password"]');
  await page.evaluate(() => {
    const loginEmail = "getlinkedin96@gmail.com";
    const loginPassword = "esfake123";
    document.querySelector('[autocomplete="username"]').value = loginEmail;
    document.querySelector('[autocomplete="current-password"]').value =
      loginPassword;
    document.querySelector('[data-id="sign-in-form__submit-btn"]').click();
  });

  await page.waitForTimeout(500);

  // Experiences
  await page.goto(
    `https://www.linkedin.com/in/${userName}/details/experience/`
  );

  await page.waitForTimeout(2000);

  const extractedExperiences = await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
    const experiences = [];
    const experiencesElements = document.querySelectorAll(
      ".pvs-list__paged-list-item.pvs-list__item--line-separated"
    );

    experiencesElements.forEach((experiencesElement) => {
      if (!experiencesElement.classList.contains("visually-hidden")) {
        const clonedElement = experiencesElement.cloneNode(true);
        const hiddenElements =
          clonedElement.querySelectorAll(".visually-hidden");
        hiddenElements.forEach((hiddenElement) => hiddenElement.remove());
        const extractedText = clonedElement.textContent
          .replace(/\s{2,}|\n/g, " ")
          .trim();
        experiences.push(extractedText);
      }
    });
    return experiences;
  });

  // Education
  await page.goto(`https://www.linkedin.com/in/${userName}/details/education/`);

  await page.waitForTimeout(2000);

  const extractedEducation = await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
    const education = [];
    const educationElements = document.querySelectorAll(
      ".pvs-list__paged-list-item.pvs-list__item--line-separated"
    );

    educationElements.forEach((educationElement) => {
      if (!educationElement.classList.contains("visually-hidden")) {
        const clonedElement = educationElement.cloneNode(true);
        const hiddenElements =
          clonedElement.querySelectorAll(".visually-hidden");
        hiddenElements.forEach((hiddenElement) => hiddenElement.remove());
        const extractedText = clonedElement.textContent
          .replace(/\s{2,}|\n/g, " ")
          .trim();
        education.push(extractedText);
      }
    });
    return education;
  });

  // Skills
  await page.goto(`https://www.linkedin.com/in/${userName}/details/skills/`);

  await page.waitForTimeout(2000);

  const extractedSkills = await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
    const skills = [];
    const skillsElements = document.querySelectorAll('[id*="ALL-SKILLS"]');

    skillsElements.forEach((skillsElement) => {
      if (!skillsElement.classList.contains("visually-hidden")) {
        const clonedElement = skillsElement.cloneNode(true);
        const hiddenElements =
          clonedElement.querySelectorAll(".visually-hidden");
        hiddenElements.forEach((hiddenElement) => hiddenElement.remove());
        let extractedText = clonedElement.textContent
          .replace(/\s{2,}|\n/g, " ")
          .trim();
        if (extractedText.includes("endorsements")) {
          extractedText = extractedText.replace(/ \d+ endorsements/g, "");
        }
        skills.push(extractedText);
      }
    });
    return skills;
  });

  // Languages
  await page.goto(`https://www.linkedin.com/in/${userName}/details/languages/`);

  await page.waitForTimeout(2000);

  const languagesExperiences = await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
    const languages = [];
    const languagesElements = document.querySelectorAll(
      ".pvs-list__paged-list-item.pvs-list__item--line-separated"
    );

    languagesElements.forEach((languagesElement) => {
      if (!languagesElement.classList.contains("visually-hidden")) {
        const clonedElement = languagesElement.cloneNode(true);
        const hiddenElements =
          clonedElement.querySelectorAll(".visually-hidden");
        hiddenElements.forEach((hiddenElement) => hiddenElement.remove());
        const extractedText = clonedElement.textContent
          .replace(/\s{2,}|\n/g, " ")
          .trim();
        experiences.push(extractedText);
      }
    });
    return languages;
  });

  fs.writeFile(
    `${userName}.txt`,
    JSON.stringify({
      Experiences: extractedExperiences,
      Education: extractedEducation,
      Skills: extractedSkills,
      Languages: languagesExperiences,
    }),
    function (error) {
      if (error) throw error;
      console.log("The file was created successfully.");
    }
  );

  await browser.close();
})();
