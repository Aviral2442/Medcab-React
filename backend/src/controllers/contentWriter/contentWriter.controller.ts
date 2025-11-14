import { Request, Response, NextFunction } from "express";
import { getBlogListService, getBlogService, addBlogService, editBlogService, updateBlogStatusService, getCityContentService, addCityContentService, fetchCityContentService } from "../../services/contentWriter/contentWriter.service";

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

// CONTROLLER TO EDIT BLOG
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

// CONTROLLER TO ADD NEW CITY CONTENT
export const addCityContentController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const cityContent = {
            city_thumbnail: req.file ?? undefined,
            city_name: req.body.city_name,
            city_title_sku: req.body.city_title_sku,
            city_title: req.body.city_title,
            city_heading: req.body.city_heading,
            city_body_desc: req.body.city_body_desc,
            city_why_choose_us: req.body.city_why_choose_us,
            why_choose_meta_desc: req.body.why_choose_meta_desc,
            city_block1_heading: req.body.city_block1_heading,
            city_block1_body: req.body.city_block1_body,
            city_block2_heading: req.body.city_block2_heading,
            city_block2_body: req.body.city_block2_body,
            city_thumbnail_alt: req.body.city_thumbnail_alt,
            city_meta_title: req.body.city_meta_title,
            city_meta_desc: req.body.city_meta_desc,
            city_meta_keyword: req.body.city_meta_keyword,
            city_force_keyword: req.body.city_force_keyword,
            city_faq_heading: req.body.city_faq_heading,
            city_emergency_desc: req.body.city_emergency_desc,
        };

        const result = await addCityContentService(cityContent);
        res.status(result.status).json(result);

    } catch (error) {
        next(error);
    }
};

// CONTROLLER TO FETCH CITY CONTENT BY CITY ID
export const fetchCityContentController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const cityId = parseInt(req.params.id);
        const result = await fetchCityContentService(cityId);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};
