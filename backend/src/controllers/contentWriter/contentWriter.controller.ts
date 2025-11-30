import { Request, Response, NextFunction } from "express";
import { getBlogListService, getBlogService, addBlogService, editBlogService, updateBlogStatusService, getCityContentService, addCityContentService, fetchCityContentService, editCityContentService, updateCityContentStatusService, getCityContentFaqListService, addCityContentFaqService, fetchCityContentFaqService, editCityContentFaqService, updateCityContentFaqStatusService, updateCityContentManpowerStatusService, editCityContentManpowerService, fetchCityContentManpowerService, addCityContentManpowerService, getCityContentManpowerService, getCityContentVideoConsultService, addCityContentVideoConsultService, fetchCityContentVideoConsultService, editCityContentVideoConsultService, updateCityContentVideoConsultStatusService, updateCityContentPathologyStatusService, editCityContentPathologyService, fetchCityContentPathologyService, addCityContentPathologyService, getCityContentPathologyService, updateCityContentPathologyFaqStatusService, editCityContentPathologyFaqService, fetchCityContentPathologyFaqService, addCityContentPathologyFaqService, getCityContentPathologyFaqListService, updateCityContentVideoConsultFaqStatusService, editCityContentVideoConsultFaqService, fetchCityContentVideoConsultFaqService, addCityContentVideoConsultFaqService, getCityContentVideoConsultFaqListService, updateCityContentManpowerFaqStatusService, editCityContentManpowerFaqService, fetchCityContentManpowerFaqService, addCityContentManpowerFaqService, getCityContentManpowerFaqListService } from "../../services/contentWriter/contentWriter.service";


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

        const status = req.body.blogs_status;

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
        const status = req.body.city_status;

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
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
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
        const status = req.body.city_faq_status;
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
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
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
        const status = req.body.city_status;

        const result = await updateCityContentManpowerStatusService(cityId, status);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};


// CONTROLLER TO GET CITY CONTENT Manpower FAQ LIST
export const getCityContentManpowerFaqListController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        }

        const result = await getCityContentManpowerFaqListService(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO ADD NEW CITY CONTENT Manpower FAQ
export const addCityContentManpowerFaqController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const faqData = {
            city_id: req.body.city_id || 0,
            city_faq_que: req.body.city_faq_que,
            city_faq_ans: req.body.city_faq_ans,
        };

        const result = await addCityContentManpowerFaqService(faqData);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO FETCH CITY CONTENT Manpower FAQ BY FAQ ID
export const fetchCityContentManpowerFaqController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const faqId = parseInt(req.params.id);
        const result = await fetchCityContentManpowerFaqService(faqId);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};

// CONTROLLER TO EDIT CITY CONTENT Manpower FAQ
export const editCityContentManpowerFaqController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const faqId = parseInt(req.params.id);
        const faqData = {
            city_id: req.body.city_id || 0,
            city_faq_que: req.body.city_faq_que,
            city_faq_ans: req.body.city_faq_ans,
        };
        const result = await editCityContentManpowerFaqService(faqId, faqData);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

// CONTROLLER TO UPDATE CITY CONTENT Manpower FAQ STATUS
export const updateCityContentManpowerFaqStatusController = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const faqId = parseInt(req.params.id);
        const status = req.body.city_faq_status;
        const result = await updateCityContentManpowerFaqStatusService(faqId, status);
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
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
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
        const status = req.body.city_status;

        const result = await updateCityContentVideoConsultStatusService(cityId, status);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};


// CONTROLLER TO GET CITY CONTENT VIDEO CONSULT FAQ LIST
export const getCityContentVideoConsultFaqListController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        }

        const result = await getCityContentVideoConsultFaqListService(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO ADD NEW CITY CONTENT VIDEO CONSULT FAQ
export const addCityContentVideoConsultFaqController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const faqData = {
            city_id: req.body.city_id || 0,
            city_faq_que: req.body.city_faq_que,
            city_faq_ans: req.body.city_faq_ans,
        };

        const result = await addCityContentVideoConsultFaqService(faqData);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO FETCH CITY CONTENT VIDEO CONSULT FAQ BY FAQ ID
export const fetchCityContentVideoConsultFaqController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const faqId = parseInt(req.params.id);
        const result = await fetchCityContentVideoConsultFaqService(faqId);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};

// CONTROLLER TO EDIT CITY CONTENT VIDEO CONSULT FAQ
export const editCityContentVideoConsultFaqController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const faqId = parseInt(req.params.id);
        const faqData = {
            city_id: req.body.city_id || 0,
            city_faq_que: req.body.city_faq_que,
            city_faq_ans: req.body.city_faq_ans,
        };
        const result = await editCityContentVideoConsultFaqService(faqId, faqData);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

// CONTROLLER TO UPDATE CITY CONTENT VIDEO CONSULT FAQ STATUS
export const updateCityContentVideoConsultFaqStatusController = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const faqId = parseInt(req.params.id);
        const status = req.body.city_faq_status;
        const result = await updateCityContentVideoConsultFaqStatusService(faqId, status);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};


// ----------------------------------------- PATHOLOGY CITY CONTENT CONTROLLERS ----------------------------------- //



// PATHOLOGY CITY CONTENT CONTROLLER LIST
export const getCityContentPathologyController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        }

        const result = await getCityContentPathologyService(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO ADD NEW PATHOLOGY CITY CONTENT
export const addCityContentPathologyController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const cityContent = {
            city_pathology_thumbnail: req.file ?? undefined,
            city_pathology_name: req.body.city_pathology_name,
            city_pathology_title_sku: req.body.city_pathology_title_sku,
            city_pathology_title: req.body.city_pathology_title,
            city_pathology_heading: req.body.city_pathology_heading,
            city_pathology_body_desc: req.body.city_pathology_body_desc,
            city_pathology_why_choose_us: req.body.city_pathology_why_choose_us,
            why_choose_meta_desc: req.body.why_choose_meta_desc,
            city_pathology_block1_heading: req.body.city_pathology_block1_heading,
            city_pathology_block1_body: req.body.city_pathology_block1_body,
            city_pathology_block2_heading: req.body.city_pathology_block2_heading,
            city_pathology_block2_body: req.body.city_pathology_block2_body,
            city_pathology_block3_heading: req.body.city_pathology_block3_heading,
            city_pathology_block3_body: req.body.city_pathology_block3_body,
            city_pathology_thumbnail_title: req.body.city_pathology_thumbnail_title,
            city_pathology_thumbnail_alt: req.body.city_pathology_thumbnail_alt,
            city_pathology_meta_title: req.body.city_pathology_meta_title,
            city_pathology_meta_desc: req.body.city_pathology_meta_desc,
            city_pathology_meta_keyword: req.body.city_pathology_meta_keyword,
            city_pathology_force_keyword: req.body.city_pathology_force_keyword,
            city_pathology_faq_heading: req.body.city_pathology_faq_heading,
            city_pathology_faq_desc: req.body.city_pathology_faq_desc,
            city_pathology_emergency_heading: req.body.city_pathology_emergency_heading,
            city_pathology_emergency_desc: req.body.city_pathology_emergency_desc,
        };

        const result = await addCityContentPathologyService(cityContent);
        res.status(result.status).json(result);

    } catch (error) {
        next(error);
    }
};

// CONTROLLER TO FETCH PATHOLOGY CITY CONTENT BY CITY ID
export const fetchCityContentPathologyController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const cityId = parseInt(req.params.id);
        const result = await fetchCityContentPathologyService(cityId);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};

// CONTROLLER TO EDIT PATHOLOGY CITY CONTENT
export const editCityContentPathologyController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cityId = parseInt(req.params.id);

        const cityContent = {
            city_pathology_thumbnail: req.file ?? undefined,
            city_pathology_name: req.body.city_pathology_name,
            city_pathology_title_sku: req.body.city_pathology_title_sku,
            city_pathology_title: req.body.city_pathology_title,
            city_pathology_heading: req.body.city_pathology_heading,
            city_pathology_body_desc: req.body.city_pathology_body_desc,
            city_pathology_why_choose_us: req.body.city_pathology_why_choose_us,
            why_choose_meta_desc: req.body.why_choose_meta_desc,
            city_pathology_block1_heading: req.body.city_pathology_block1_heading,
            city_pathology_block1_body: req.body.city_pathology_block1_body,
            city_pathology_block2_heading: req.body.city_pathology_block2_heading,
            city_pathology_block2_body: req.body.city_pathology_block2_body,
            city_pathology_block3_heading: req.body.city_pathology_block3_heading,
            city_pathology_block3_body: req.body.city_pathology_block3_body,
            city_pathology_thumbnail_title: req.body.city_pathology_thumbnail_title,
            city_pathology_thumbnail_alt: req.body.city_pathology_thumbnail_alt,
            city_pathology_meta_title: req.body.city_pathology_meta_title,
            city_pathology_meta_desc: req.body.city_pathology_meta_desc,
            city_pathology_meta_keyword: req.body.city_pathology_meta_keyword,
            city_pathology_force_keyword: req.body.city_pathology_force_keyword,
            city_pathology_faq_heading: req.body.city_pathology_faq_heading,
            city_pathology_faq_desc: req.body.city_pathology_faq_desc,
            city_pathology_emergency_heading: req.body.city_pathology_emergency_heading,
            city_pathology_emergency_desc: req.body.city_pathology_emergency_desc,
        };

        const result = await editCityContentPathologyService(cityId, cityContent);
        res.status(result.status).json(result);
    } catch (error) {
        next(error);
    }
};

// PATHOLOGY CONTROLLER TO UPDATE CITY CONTENT STATUS
export const updateCityContentPathologyStatusController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cityId = parseInt(req.params.id);
        const status = req.body.city_pathology_status;

        console.log("Pathology Status Update - Received:", { cityId, status, body: req.body });

        const result = await updateCityContentPathologyStatusService(cityId, status);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};


// CONTROLLER TO GET CITY CONTENT PATHOLOGY FAQ LIST
export const getCityContentPathologyFaqListController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        }

        const result = await getCityContentPathologyFaqListService(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO ADD NEW CITY CONTENT PATHOLOGY FAQ
export const addCityContentPathologyFaqController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const faqData = {
            city_pathology_id: req.body.city_pathology_id || 0,
            city_pathology_faq_que: req.body.city_pathology_faq_que,
            city_pathology_faq_ans: req.body.city_pathology_faq_ans,
        };

        const result = await addCityContentPathologyFaqService(faqData);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO FETCH CITY CONTENT PATHOLOGY FAQ BY FAQ ID
export const fetchCityContentPathologyFaqController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const faqId = parseInt(req.params.id);
        const result = await fetchCityContentPathologyFaqService(faqId);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};

// CONTROLLER TO EDIT CITY CONTENT PATHOLOGY FAQ
export const editCityContentPathologyFaqController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const faqId = parseInt(req.params.id);
        const faqData = {
            city_pathology_id: req.body.city_pathology_id || 0,
            city_pathology_faq_que: req.body.city_pathology_faq_que,
            city_pathology_faq_ans: req.body.city_pathology_faq_ans,
        };
        const result = await editCityContentPathologyFaqService(faqId, faqData);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

// CONTROLLER TO UPDATE CITY CONTENT PATHOLOGY FAQ STATUS
export const updateCityContentPathologyFaqStatusController = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const faqId = parseInt(req.params.id);
        const status = req.body.city_pathology_faq_status;
        const result = await updateCityContentPathologyFaqStatusService(faqId, status);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};