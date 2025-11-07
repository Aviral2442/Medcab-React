import axios from "axios";
const baseURL = (import.meta as any).env?.VITE_IMAGE_PATH ?? "";

let catRows: any[] = [];
const getCategories = async () => {
    try{
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
    mp_cat_id : number
    mp_cat_name: string
    mp_cat_image: string
    mp_cat_top_rated_status: string
    mp_cat_status: string
}

export const categoryColumns = [
    {
      data: "S.No.", 
      render: (_data: any, _type: any, _row: any, meta: any) => {
        return meta.row + 1;
      }
    },
    {data: 'mp_cat_id'},
    {data: 'mp_cat_name'},
    {data: 'mp_cat_image', render: (data: string) => `<img src="${baseURL}${data}" alt="Category Image" style="width: 50px; height: auto;" />`},
    {data: 'mp_cat_top_rated_status', render: (data: number) => data == 1 ? 'Yes' : 'No'},
    {data: 'mp_cat_status', render: (data: number) => {
      // console.log(data);
      if (data == 0) {
        return `<span class="badge badge-label badge-soft-success">Active</span>`;
      } else if (data == 1) {
        return `<span class="badge badge-label badge-soft-danger">Inactive</span>`;
      } else {
        return `<span class="badge badge-label badge-soft-secondary">Deleted</span>`;
      }
    }},
]
export const subCategoryColumns = [
  {
      data: "S.No.", 
      render: (_data: any, _type: any, _row: any, meta: any) => {
        return meta.row + 1;
      }
    },
    {data: 'mp_sub_category_id'},
    {data: 'mp_cat_name'},
    {data: 'mpsc_name'},
    {data: 'mpsc_image', render: (data: string) => `<img src="${baseURL}${data}" alt="Category Image" style="width: 50px; height: auto;" />`},
    {data: 'mpsc_overview'},
    {data: 'mpsc_description'},
    {data: 'mpsc_gst_percentage'},
    {data: 'mpsc_emergency_status', render: (data: number) => data == 0 ? 'Yes' : 'No'},
    {data: 'mpsc_popular_status', render: (data: number) => data == 0 ? 'Yes' : 'No'},
    {data: 'mpsc_status', render: (data: number) => {
      // console.log(data);
      if (data == 0) {
        return `<span class="badge badge-label badge-soft-success">Active</span>`;
      } else if (data == 1) {
        return `<span class="badge badge-label badge-soft-danger">Inactive</span>`;
      } else {
        return `<span class="badge badge-label badge-soft-secondary">Deleted</span>`;
      }
    }},
]

export const couponColumns = [
  {
      data: "S.No.", 
      render: (_data: any, _type: any, _row: any, meta: any) => {
        return meta.row + 1;
      }
    },
  { data: "mpc_coupon_id" },
  { data: "mpc_coupon_code" },
  { data: "mpc_coupon_description" },
  { data: "mpc_coupon_min_cart_value" },
  { data: "mpc_coupon_discount_percent", render: (data: number) => `${data}%` },
  { data: "mpc_coupon_discount_amount", render: (data: number) => `₹${data}` },
  { data: "mpc_coupon_max_discount_value", render: (data: number) => `₹${data}` },
  {
    data: "mpc_coupon_visible",
    render: (data: string) =>
      data == "1"
        ? `<span class="badge badge-label badge-soft-success">Yes</span>`
        : `<span class="badge badge-label badge-soft-warning">No</span>`,
  },
  {
    data: "mpc_coupon_status",
    render: (data: string) => {
      if (data == "0") {
        return `<span class="badge badge-label badge-soft-success">Active</span>`;
      } else {
        return `<span class="badge badge-label badge-soft-danger">Inactive</span>`;
      }
    }
  }
];

export const bannerColumns = [
  {
      data: "S.No.", 
      render: (_data: any, _type: any, _row: any, meta: any) => {
        return meta.row + 1;
      }
    },
  { data: "banner_id" },
  {
    data: "banner_image",
    render: (data: string) =>
      `<img src="${baseURL}${data}" alt="Banner Image" style="width: 80px; height: auto;" />`,
  },
  { data: "banner_page" },
  {
    data: "banner_status",
    render: (data: string) => {
      if (data == "0") {
        return `<span class="badge badge-label badge-soft-success">Active</span>`;
      } else {
        return `<span class="badge badge-label badge-soft-danger">Inactive</span>`;
      }
    },
  },
];
export const priceMapperColumns = [
  {
      data: "S.No.", 
      render: (_data: any, _type: any, _row: any, meta: any) => {
        return meta.row + 1;
      }
    },
  { data: "mppm_id" },
  { data: "mpsc_name" },
  { data: "mppm_visit_rate" },
  { data: "mppm_days_rate" },
  { data: "mppm_month_rate" },
  { data: "mppm_gender" },
  { data: "mppm_city_id" },
  {
    data: "mppm_status",
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
    header: ["S.No." ,'ID', 'Name', 'Image', 'Top Rated', 'Status'],
    body: catRows,
}