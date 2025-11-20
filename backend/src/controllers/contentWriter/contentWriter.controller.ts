import { Request, Response, NextFunction } from "express";
import { getBlogListService, getBlogService, addBlogService, editBlogService, updateBlogStatusService, getCityContentService, addCityContentService, fetchCityContentService, editCityContentService, updateCityContentStatusService, getCityContentFaqListService, addCityContentFaqService, fetchCityContentFaqService, editCityContentFaqService, updateCityContentFaqStatusService, updateCityContentManpowerStatusService, editCityContentManpowerService, fetchCityContentManpowerService, addCityContentManpowerService, getCityContentManpowerService, getCityContentVideoConsultService, addCityContentVideoConsultService, fetchCityContentVideoConsultService, editCityContentVideoConsultService, updateCityContentVideoConsultStatusService } from "../../services/contentWriter/contentWriter.service";


// --------------------------------------------- BLOGS CONTROLLERS ----------------------------------------------------- //


// CONTROLLER TO GET BLOG LIST
export const getBlogListController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
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


// ----------------------------------------- AMBULANCE CITY CONTENT CONTROLLERS --------------------------------------- //


// CONTROLLER TO GET CITY CONTENT
export const getCityContentController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
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
            city_block3_heading: req.body.city_block3_heading,
            city_block3_body: req.body.city_block3_body,
            city_thumbnail_title: req.body.city_thumbnail_title,
            city_thumbnail_alt: req.body.city_thumbnail_alt,
            city_meta_title: req.body.city_meta_title,
            city_meta_desc: req.body.city_meta_desc,
            city_meta_keyword: req.body.city_meta_keyword,
            city_force_keyword: req.body.city_force_keyword,
            city_faq_heading: req.body.city_faq_heading,
            city_faq_desc: req.body.city_faq_desc,
            city_emergency_heading: req.body.city_emergency_heading,
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

// CONTROLLER TO EDIT CITY CONTENT
export const editCityContentController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cityId = parseInt(req.params.id);

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
            city_block3_heading: req.body.city_block3_heading,
            city_block3_body: req.body.city_block3_body,
            city_thumbnail_title: req.body.city_thumbnail_title,
            city_thumbnail_alt: req.body.city_thumbnail_alt,
            city_meta_title: req.body.city_meta_title,
            city_meta_desc: req.body.city_meta_desc,
            city_meta_keyword: req.body.city_meta_keyword,
            city_force_keyword: req.body.city_force_keyword,
            city_faq_heading: req.body.city_faq_heading,
            city_faq_desc: req.body.city_faq_desc,
            city_emergency_heading: req.body.city_emergency_heading,
            city_emergency_desc: req.body.city_emergency_desc,
        };

        const result = await editCityContentService(cityId, cityContent);
        res.status(result.status).json(result);
    } catch (error) {
        next(error);
    }
};

// CONTROLLER TO UPDATE CITY CONTENT STATUS
export const updateCityContentStatusController = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const cityId = parseInt(req.params.id);
        const status = req.body.status;

        const result = await updateCityContentStatusService(cityId, status);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};

// CONTROLLER TO GET CITY CONTENT FAQ LIST
export const getCityContentFaqListController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
        }

        const result = await getCityContentFaqListService(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO ADD NEW CITY CONTENT FAQ
export const addCityContentFaqController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const faqData = {
            city_id: req.body.city_id || 0,
            city_faq_que: req.body.city_faq_que,
            city_faq_ans: req.body.city_faq_ans,
        };

        const result = await addCityContentFaqService(faqData);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO FETCH CITY CONTENT FAQ BY FAQ ID
export const fetchCityContentFaqController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const faqId = parseInt(req.params.id);
        const result = await fetchCityContentFaqService(faqId);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};

// CONTROLLER TO EDIT CITY CONTENT FAQ
export const editCityContentFaqController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const faqId = parseInt(req.params.id);
        const faqData = {
            city_id: req.body.city_id || 0,
            city_faq_que: req.body.city_faq_que,
            city_faq_ans: req.body.city_faq_ans,
        };
        const result = await editCityContentFaqService(faqId, faqData);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

// CONTROLLER TO UPDATE CITY CONTENT FAQ STATUS
export const updateCityContentFaqStatusController = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const faqId = parseInt(req.params.id);
        const status = req.body.status;
        const result = await updateCityContentFaqStatusService(faqId, status);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};



// ----------------------------------------- MANPOWER CITY CONTENT CONTROLLERS ------------------------------------------ //



// MANPOWER CITY CONTENT CONTROLLER LIST
export const getCityContentManpowerController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
        }

        const result = await getCityContentManpowerService(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO ADD NEW MANPOWER CITY CONTENT
export const addCityContentManpowerController = async (req: Request, res: Response, next: NextFunction) => {

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
            city_block3_heading: req.body.city_block3_heading,
            city_block3_body: req.body.city_block3_body,
            city_thumbnail_title: req.body.city_thumbnail_title,
            city_thumbnail_alt: req.body.city_thumbnail_alt,
            city_meta_title: req.body.city_meta_title,
            city_meta_desc: req.body.city_meta_desc,
            city_meta_keyword: req.body.city_meta_keyword,
            city_force_keyword: req.body.city_force_keyword,
            city_faq_heading: req.body.city_faq_heading,
            city_faq_desc: req.body.city_faq_desc,
            city_emergency_heading: req.body.city_emergency_heading,
            city_emergency_desc: req.body.city_emergency_desc,
        };

        const result = await addCityContentManpowerService(cityContent);
        res.status(result.status).json(result);

    } catch (error) {
        next(error);
    }
};

// CONTROLLER TO FETCH MANPOWER CITY CONTENT BY CITY ID
export const fetchCityContentManpowerController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const cityId = parseInt(req.params.id);
        const result = await fetchCityContentManpowerService(cityId);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};

// CONTROLLER TO EDIT MANPOWER CITY CONTENT
export const editCityContentManpowerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cityId = parseInt(req.params.id);

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
            city_block3_heading: req.body.city_block3_heading,
            city_block3_body: req.body.city_block3_body,
            city_thumbnail_title: req.body.city_thumbnail_title,
            city_thumbnail_alt: req.body.city_thumbnail_alt,
            city_meta_title: req.body.city_meta_title,
            city_meta_desc: req.body.city_meta_desc,
            city_meta_keyword: req.body.city_meta_keyword,
            city_force_keyword: req.body.city_force_keyword,
            city_faq_heading: req.body.city_faq_heading,
            city_faq_desc: req.body.city_faq_desc,
            city_emergency_heading: req.body.city_emergency_heading,
            city_emergency_desc: req.body.city_emergency_desc,
        };

        const result = await editCityContentManpowerService(cityId, cityContent);
        res.status(result.status).json(result);
    } catch (error) {
        next(error);
    }
};

// MANPOWER CONTROLLER TO UPDATE CITY CONTENT STATUS
export const updateCityContentManpowerStatusController = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const cityId = parseInt(req.params.id);
        const status = req.body.status;

        const result = await updateCityContentManpowerStatusService(cityId, status);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};



// ----------------------------------------- VIDEO CONSULT CITY CONTENT CONTROLLERS ----------------------------------- //



// VIDEO CONSULT CITY CONTENT CONTROLLER LIST
export const getCityContentVideoConsultController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
        }

        const result = await getCityContentVideoConsultService(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO ADD NEW VIDEO CONSULT CITY CONTENT
export const addCityContentVideoConsultController = async (req: Request, res: Response, next: NextFunction) => {

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
            city_block3_heading: req.body.city_block3_heading,
            city_block3_body: req.body.city_block3_body,
            city_thumbnail_title: req.body.city_thumbnail_title,
            city_thumbnail_alt: req.body.city_thumbnail_alt,
            city_meta_title: req.body.city_meta_title,
            city_meta_desc: req.body.city_meta_desc,
            city_meta_keyword: req.body.city_meta_keyword,
            city_force_keyword: req.body.city_force_keyword,
            city_faq_heading: req.body.city_faq_heading,
            city_faq_desc: req.body.city_faq_desc,
            city_emergency_heading: req.body.city_emergency_heading,
            city_emergency_desc: req.body.city_emergency_desc,
        };

        const result = await addCityContentVideoConsultService(cityContent);
        res.status(result.status).json(result);

    } catch (error) {
        next(error);
    }
};

// CONTROLLER TO FETCH VIDEO CONSULT CITY CONTENT BY CITY ID
export const fetchCityContentVideoConsultController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const cityId = parseInt(req.params.id);
        const result = await fetchCityContentVideoConsultService(cityId);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};

// CONTROLLER TO EDIT VIDEO CONSULT CITY CONTENT
export const editCityContentVideoConsultController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cityId = parseInt(req.params.id);

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
            city_block3_heading: req.body.city_block3_heading,
            city_block3_body: req.body.city_block3_body,
            city_thumbnail_title: req.body.city_thumbnail_title,
            city_thumbnail_alt: req.body.city_thumbnail_alt,
            city_meta_title: req.body.city_meta_title,
            city_meta_desc: req.body.city_meta_desc,
            city_meta_keyword: req.body.city_meta_keyword,
            city_force_keyword: req.body.city_force_keyword,
            city_faq_heading: req.body.city_faq_heading,
            city_faq_desc: req.body.city_faq_desc,
            city_emergency_heading: req.body.city_emergency_heading,
            city_emergency_desc: req.body.city_emergency_desc,
        };

        const result = await editCityContentVideoConsultService(cityId, cityContent);
        res.status(result.status).json(result);
    } catch (error) {
        next(error);
    }
};

// VIDEO CONSULT CONTROLLER TO UPDATE CITY CONTENT STATUS
export const updateCityContentVideoConsultStatusController = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const cityId = parseInt(req.params.id);
        const status = req.body.status;

        const result = await updateCityContentVideoConsultStatusService(cityId, status);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};