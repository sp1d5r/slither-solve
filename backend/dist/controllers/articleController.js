"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArticleBySlug = exports.getArticles = void 0;
const client_1 = require("@notionhq/client");
const notion_to_md_1 = require("notion-to-md");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const notion = new client_1.Client({ auth: process.env.NOTION_API_KEY });
const getArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID,
        });
        const articles = response.results
            .filter((page) => 'properties' in page)
            .map((page) => {
            var _a, _b, _c, _d;
            const properties = {};
            for (const [key, value] of Object.entries(page.properties)) {
                switch (value.type) {
                    case 'title':
                        properties[key] = ((_a = value.title[0]) === null || _a === void 0 ? void 0 : _a.plain_text) || '';
                        break;
                    case 'rich_text':
                        properties[key] = ((_b = value.rich_text[0]) === null || _b === void 0 ? void 0 : _b.plain_text) || '';
                        break;
                    case 'date':
                        properties[key] = ((_c = value.date) === null || _c === void 0 ? void 0 : _c.start) || undefined;
                        break;
                    case 'checkbox':
                        properties[key] = value.checkbox;
                        break;
                    case 'multi_select':
                        properties[key] = value.multi_select.map((item) => item.name);
                        break;
                    case 'select':
                        properties[key] = ((_d = value.select) === null || _d === void 0 ? void 0 : _d.name) || undefined;
                        break;
                    case 'number':
                        properties[key] = value.number || 0;
                        break;
                    case 'url':
                        properties[key] = value.url || "";
                        break;
                    default:
                        properties[key] = JSON.stringify(value);
                }
            }
            return {
                id: page.id,
                properties,
                url: page.url,
                cover: page.cover,
            };
        });
        res.json(articles);
    }
    catch (error) {
        console.error('Error fetching articles from Notion:', error);
        res.status(500).json({ error: 'Failed to fetch articles from Notion' });
    }
});
exports.getArticles = getArticles;
const getArticleBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { slug } = req.params;
        const response = yield notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID,
            filter: {
                property: "Slug",
                rich_text: {
                    equals: slug
                }
            }
        });
        if (response.results.length === 0) {
            res.status(404).json({ error: "Article not found" });
            return;
        }
        const page = response.results[0];
        const n2m = new notion_to_md_1.NotionToMarkdown({ notionClient: notion });
        const mdblocks = yield n2m.pageToMarkdown(page.id);
        const mdString = n2m.toMarkdownString(mdblocks);
        const properties = {};
        for (const [key, value] of Object.entries(page.properties)) {
            switch (value.type) {
                case 'title':
                    properties[key] = ((_a = value.title[0]) === null || _a === void 0 ? void 0 : _a.plain_text) || '';
                    break;
                case 'rich_text':
                    properties[key] = ((_b = value.rich_text[0]) === null || _b === void 0 ? void 0 : _b.plain_text) || '';
                    break;
                case 'date':
                    properties[key] = ((_c = value.date) === null || _c === void 0 ? void 0 : _c.start) || undefined;
                    break;
                case 'checkbox':
                    properties[key] = value.checkbox;
                    break;
                case 'multi_select':
                    properties[key] = value.multi_select.map((item) => item.name);
                    break;
                case 'select':
                    properties[key] = ((_d = value.select) === null || _d === void 0 ? void 0 : _d.name) || undefined;
                    break;
                case 'number':
                    properties[key] = value.number || undefined;
                    break;
                case 'url':
                    properties[key] = value.url || undefined;
                    break;
                default:
                    properties[key] = JSON.stringify(value);
            }
        }
        const article = {
            id: page.id,
            properties,
            url: page.url,
            cover: page.cover,
            content: mdString.parent
        };
        res.json(article);
    }
    catch (error) {
        console.error('Error fetching article from Notion:', error);
        res.status(500).json({ error: 'Failed to fetch article from Notion' });
    }
});
exports.getArticleBySlug = getArticleBySlug;
