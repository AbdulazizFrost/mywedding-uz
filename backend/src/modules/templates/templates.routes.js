import { Router } from 'express';
import { getTemplates, getTemplateBySlug } from './templates.controller.js';

const templatesRouter = Router();

templatesRouter.get('/', getTemplates);
templatesRouter.get('/:slug', getTemplateBySlug);

export { templatesRouter };
