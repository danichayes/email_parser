import { simpleParser } from 'mailparser';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

async function loadEmail(filePath) {
    try {
        const rawEmail = await fs.promises.readFile(filePath, 'utf-8');
        return rawEmail;
    } catch (error){
        console.error('Error reading the email file:', error);
        return null;
    }
}

async function writeHtmlToFile(html, outputPath) {
    try {
        await fs.promises.writeFile(outputPath, html, 'utf-8');
    } catch (error) {
        console.error('Error writing the html content to file:', error);
    }
    
}
async function extractHtml(filePath, outputPath) {
    try {
        const rawEmail = await loadEmail(filePath);

        if (!rawEmail){ 
            console.log("Failed to load email content.")
            return;
        }

        const parsed = await simpleParser(rawEmail);
        const htmlContent = parsed.html;

        if (htmlContent) {
            const $ = cheerio.load(htmlContent);
            const mainContent = $('body').html();

            await writeHtmlToFile(mainContent, outputPath)
        }
        else {
            console.log("No HTML content found in email.");
        }
    } catch (error) {
        console.error("Error parsing email", error);
    }
}

const emailFilePath = '/Users/danielcpostgrad/Documents/email_parser/tldr.eml'
const outputPath = '/Users/danielcpostgrad/Documents/email_parser/parsed_tldr.html'

extractHtml(emailFilePath, outputPath);
