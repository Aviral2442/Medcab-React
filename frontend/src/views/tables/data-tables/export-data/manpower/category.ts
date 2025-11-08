import axios from "axios";
const baseURL = (import.meta as any).env?.VITE_IMAGE_PATH ?? "";

let catRows: any[] = [];
const getCategories = async () => {
  try {
    const rows = await axios.get(`${baseURL}/manpower/get-category`);
    console.log("Categories fetched:", rows);
    catRows = rows.data.categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}
await getCategories();

type TableType<T> = {
  header: string[]
  body: T[]
}

type categoryInfoType = {
  mp_cat_id: number
  mp_cat_name: string
  mp_cat_image: string
  mp_cat_top_rated_status: string
  mp_cat_status: string
}

// CATEGORY COLUMNS
export const categoryColumns = [
  {
    data: null,
    orderable: false,
    searchable: false,
    render: (_data: any, _type: any, _row: any, meta: any) => {
      return meta.row + 1;
    }
  },
  { 
    data: 'mp_cat_id',
    defaultContent: '-'
  },
  {   
    data: 'mp_cat_name',
    defaultContent: '-'
  },
  { 
    data: 'mp_cat_image',
    defaultContent: '',
    render: (data: string) => data ? `<img src="${baseURL}${data}" alt="Category Image" style="width: 50px; height: auto;" />` : '-'
  },
  { 
    data: 'mp_cat_top_rated_status',
    defaultContent: '0',
    render: (data: number) => data == 1 ? 'Yes' : 'No'
  },
  {
    data: 'mp_cat_status',
    defaultContent: '1',
    render: (data: number) => {
      if (data == 0) {
        return `<span class="badge badge-label badge-soft-success">Active</span>`;
      } else if (data == 1) {
        return `<span class="badge badge-label badge-soft-danger">Inactive</span>`;
      } else {
        return `<span class="badge badge-label badge-soft-secondary">Deleted</span>`;
      }
    }
  },
];

// SUB-CATEGORY COLUMNS
export const subCategoryColumns = [
  {
    data: null,
    orderable: false,
    searchable: false,
    render: (_data: any, _type: any, _row: any, meta: any) => {
      return meta.row + 1;
    }
  },
  { 
    data: 'mp_sub_category_id',
    defaultContent: '-'
  },
  { 
    data: 'mp_cat_name',
    defaultContent: '-'
  },
  { 
    data: 'mpsc_name',
    defaultContent: '-'
  },
  { 
    data: 'mpsc_image',
    defaultContent: '',
    render: (data: string) => data ? `<img src="${baseURL}${data}" alt="SubCategory Image" style="width: 50px; height: auto;" />` : '-'
  },
  { 
    data: 'mpsc_overview',
    defaultContent: '-'
  },
  { 
    data: 'mpsc_description',
    defaultContent: '-'
  },
  { 
    data: 'mpsc_gst_percentage',
    defaultContent: '0'
  },
  { 
    data: 'mpsc_emergency_status',
    defaultContent: '1',
    render: (data: number) => data == 0 ? 'Yes' : 'No'
  },
  { 
    data: 'mpsc_popular_status',
    defaultContent: '1',
    render: (data: number) => data == 0 ? 'Yes' : 'No'
  },
  {
    data: 'mpsc_status',
    defaultContent: '1',
    render: (data: number) => {
      if (data == 0) {
        return `<span class="badge badge-label badge-soft-success">Active</span>`;
      } else if (data == 1) {
        return `<span class="badge badge-label badge-soft-danger">Inactive</span>`;
      } else {
        return `<span class="badge badge-label badge-soft-secondary">Deleted</span>`;
      }
    }
  },
];

// COUPON COLUMNS
export const couponColumns = [
  {
    data: null,
    orderable: false,
    searchable: false,
    render: (_data: any, _type: any, _row: any, meta: any) => {
      return meta.row + 1;
    }
  },
  { 
    data: "mpc_coupon_id",
    defaultContent: '-'
  },
  { 
    data: "mpc_coupon_code",
    defaultContent: '-'
  },
  { 
    data: "mpc_coupon_description",
    defaultContent: '-'
  },
  { 
    data: "mpc_coupon_min_cart_value",
    defaultContent: '0'
  },
  { 
    data: "mpc_coupon_discount_percentage",
    defaultContent: '0'
  },
  { 
    data: "mpc_coupon_max_discount_amount",
    defaultContent: '0'
  },
  { 
    data: "mpc_coupon_max_discount_amount",
    defaultContent: '0'
  },
  {
    data: "mpc_coupon_visible",
    defaultContent: '1',
    render: (data: string) => {
      if (data == "0") {
        return `<span class="badge badge-label badge-soft-success">Yes</span>`;
      } else {
        return `<span class="badge badge-label badge-soft-danger">No</span>`;
      }
    },
  },
  {
    data: "mpc_coupon_status",
    defaultContent: '1',
    render: (data: string) => {
      if (data == "0") {
        return `<span class="badge badge-label badge-soft-success">Active</span>`;
      } else {
        return `<span class="badge badge-label badge-soft-danger">Inactive</span>`;
      }
    },
  },
];


export const faqColumns = [
  {
    data: null,
    orderable: false,
    searchable: false,
    render: (_data: any, _type: any, _row: any, meta: any) => {
      return meta.row + 1;
    }
  },
  {
    data: "manpower_faq_id",
    defaultContent: '-'
  },
  {
    data: "manpower_faq_header",
    defaultContent: '-'
  },
  {
    data: "manpower_faq_description",
    defaultContent: '-'
  },
  {
    data: "manpower_faq_status",
    defaultContent: '1',
    render: (data: string) => {
      if (data == "0") {
        return `<span class="badge badge-label badge-soft-success">Active</span>`;
      } else {
        return `<span class="badge badge-label badge-soft-danger">Inactive</span>`;
      }
    },
  }
];

// BANNER COLUMNS
export const bannerColumns = [
  {
    data: null,
    orderable: false,
    searchable: false,
    render: (_data: any, _type: any, _row: any, meta: any) => {
      return meta.row + 1;
    }
  },
  { 
    data: "banner_id",
    defaultContent: '-'
  },
  {
    data: "banner_image",
    defaultContent: '',
    render: (data: string) =>
      data ? `<img src="${baseURL}${data}" alt="Banner Image" style="width: 80px; height: auto;" />` : '-',
  },
  { 
    data: "banner_page",
    defaultContent: '-'
  },
  {
    data: "banner_status",
    defaultContent: '1',
    render: (data: string) => {
      if (data == "0") {
        return `<span class="badge badge-label badge-soft-success">Active</span>`;
      } else {
        return `<span class="badge badge-label badge-soft-danger">Inactive</span>`;
      }
    },
  },
];

// PRICE MAPPER COLUMNS
export const priceMapperColumns = [
  {
    data: null,
    orderable: false,
    searchable: false,
    render: (_data: any, _type: any, _row: any, meta: any) => {
      return meta.row + 1;
    }
  },
  { 
    data: "mppm_id",
    defaultContent: '-'
  },
  { 
    data: "mpsc_name",
    defaultContent: '-'
  },
  { 
    data: "mppm_visit_rate",
    defaultContent: '0'
  },
  { 
    data: "mppm_days_rate",
    defaultContent: '0'
  },
  { 
    data: "mppm_month_rate",
    defaultContent: '0'
  },
  { 
    data: "mppm_gender",
    defaultContent: '-'
  },
  { 
    data: "mppm_city_id",
    defaultContent: '-'
  },
  {
    data: "mppm_status",
    defaultContent: '1',
    render: (data: string) => {
      if (data == "0") {
        return `<span class="badge badge-label badge-soft-success">Active</span>`;
      } else if (data == "1") {
        return `<span class="badge badge-label badge-soft-danger">Inactive</span>`;
      } else {
        return `<span class="badge badge-label badge-soft-secondary">Deleted</span>`;
      }
    },
  },
];

export const categoryTableData: TableType<categoryInfoType> = {
  header: ["S.No.", 'ID', 'Name', 'Image', 'Top Rated', 'Status'],
  body: catRows,
}