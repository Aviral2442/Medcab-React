import { Request, Response, NextFunction } from "express";
import { getBlogListService, getBlogService, addBlogService, editBlogService, updateBlogStatusService, getCityContentService } from "../../services/contentWriter/contentWriter.service";
import { Next } from "mysql2/typings/mysql/lib/parsers/typeCast";

// CONTROLLER TO GET BLOG LIST WITH FILTERS AND PAGINATION
export const getBlogListController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        }

        const result = await getBlogListService(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO ADD NEW BLOG
export const addBlogController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const blogData = {
            blogs_image: req.file,
            blogs_title: req.body.blogs_title,
            blogs_sku: req.body.blogs_sku,
            blogs_short_desc: req.body.blogs_short_desc,
            blogs_long_desc: req.body.blogs_long_desc,
            blogs_category: req.body.blogs_category,
            blogs_meta_title: req.body.blogs_meta_title,
            blogs_meta_desc: req.body.blogs_meta_desc,
            blogs_meta_keywords: req.body.blogs_meta_keywords,
            blogs_force_keywords: req.body.blogs_force_keywords,
            blogs_schema: req.body.blogs_schema,
        }

        const result = await addBlogService(blogData);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

export const editBlogController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const blogId = parseInt(req.params.id);

        const blogData = {
            blogs_image: req.file,
            blogs_title: req.body.blogs_title,
            blogs_sku: req.body.blogs_sku,
            blogs_short_desc: req.body.blogs_short_desc,
            blogs_long_desc: req.body.blogs_long_desc,
            blogs_category: req.body.blogs_category,
            blogs_meta_title: req.body.blogs_meta_title,
            blogs_meta_desc: req.body.blogs_meta_desc,
            blogs_meta_keywords: req.body.blogs_meta_keywords,
            blogs_force_keywords: req.body.blogs_force_keywords,
            blogs_schema: req.body.blogs_schema,
        };

        const result = await editBlogService(blogId, blogData);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO UPDATE BLOG STATUS
export const updateBlogStatusController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const blogId = parseInt(req.params.id);

        const status = req.body.status;

        const result = await updateBlogStatusService(blogId, status);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};

// CONTROLLER TO GET CITY CONTENT WITH FILTERS AND PAGINATION
export const getCityContentController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        }

        const result = await getCityContentService(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO GET SINGLE BLOG
export const getBlogController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blogId = parseInt(req.params.id);
        const result = await getBlogService(blogId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};