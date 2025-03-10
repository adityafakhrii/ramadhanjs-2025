#!/usr/bin/env node

import dotenv from "dotenv";
dotenv.config();
const apiKey = process.env.API_KEY;

const apiUrl = `https://hadithapi.com/api/hadiths?apiKey=${apiKey}`;

async function fetchAndDisplayHadith() {
  try {
    const chalk = await import("chalk");
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (
      data &&
      data.hadiths &&
      Array.isArray(data.hadiths.data) &&
      data.hadiths.data.length > 0
    ) {
      const randomHadith =
        data.hadiths.data[Math.floor(Math.random() * data.hadiths.data.length)];

      console.log(
        chalk.default.green.bold(
          `\nHadith Reference: ${randomHadith.book.bookName} - ${randomHadith.hadithNumber}\n`
        )
      );

      console.log(chalk.default.yellow(randomHadith.headingArabic + "\n"));
      console.log(chalk.default.blue(randomHadith.hadithArabic + "\n"));
      console.log(chalk.default.green(randomHadith.headingEnglish + "\n"));
      console.log(chalk.default.cyan(randomHadith.hadithEnglish + "\n"));
      console.log(chalk.default.gray.bold("English Narrator:"));
      console.log(chalk.default.gray(randomHadith.englishNarrator + "\n"));
    } else {
      console.log(chalk.default.red("No hadiths found in response."));
    }
  } catch (error) {
    const chalk = await import("chalk");
    console.error(chalk.default.red("Error fetching hadith:"), error);
  }
}

fetchAndDisplayHadith();
