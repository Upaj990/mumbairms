{/* DOMAIN */}
// const DOMAIN = 'https://1d38-2405-201-500b-2051-95e3-a3df-3179-61b0.in.ngrok.io'
// const DOMAIN = 'http://bohfy-personnel.herokuapp.com'
// const DOMAIN = 'http://192.168.29.195:8080'
//const DOMAIN = 'http://35.85.45.167:8080'
//const DOMAIN= 'http://127.0.0.1:8080'
const DOMAIN='https://rm.bohfy.com:8443'
{/* API VERSION */}
const API_VERSION = "/api/v1/"
{/* BASE URL */}
const BASE_URL = DOMAIN+API_VERSION
{/* FILE URL */}
const FILE = '/files/'
const FILE_URL = DOMAIN+FILE
{/* PATH */}
const PATH = {
    REGISTER:'admin/admins/register',
    LOGIN:'admin/admins/login',
    ADMIN_DETAILS:'admin/admins/admin_details',
    IDENTITY_PROOF_UPDATE:'admin/admins/identity_proof_update',
    UPDATE_ADMINS_DETAILS:'admin/admins/update_admins_details',
    PROFILE_UPDATE:'admin/admins/profile_update',
    UPDATE_ADMINS_PASSWORD:'admin/admins/update_admins_password',
    UPDATE_ADMINS_PASSWORD_WITH_OLD_PASSWORD:'admin/admins/update_admins_password_with_old_password',
    DELETE_ADMINS:'admin/admins/delete_admins',
    LIST_OF_MANAGERS:'admin/admins/list_of_managers',
    LIST_OF_WAITERS:'admin/admins/list_of_waiters',
    LIST_OF_CHEFS:'admin/admins/list_of_chefs',
    ADD_CATEGORY:'admin/category/add_category',
    CATEGORY_IMAGE_UPDATE:'admin/category/image_update',
    LIST_OF_CATEGORY:'admin/category/list_of_category',
    UPDATE_CATEGORY:'admin/category/update_category',
    DELETE_CATEGORY:'admin/category/delete_category',
    ADD_ADDONS:'admin/addons/add_addons',
    ADD_CUISINES:'admin/cuisines/add_cuisines',
    SEARCH_ADDONS:'admin/addons/search_addons',
    LIST_OF_ADDONS:'admin/addons/list_0f_addons',
    UPDATE_ADDONS:'admin/addons/update_addons',
    DELETE_ADDONS:'admin/addons/delete_addons',
    LIST_OF_CUISINES:'admin/cuisines/list_0f_cuisines',
    UPDATE_CUISINES:'admin/cuisines/update_cuisines',
    DELETE_CUISINES:'admin/cuisines/delete_cuisines',
    ADD_BANNER:'admin/banner/add_banner',
    UPDATE_BANNER_IMAGE:'admin/banner/image_update',
    UPDATE_BANNER:'admin/banner/update_banner',
    LIST_OF_BANNER:'admin/banner/list_of_banner',
    DELETE_BANNER:'admin/banner/delete_banner',
    LIST_OF_WEEKS:'admin/weeks/list_0f_weeks',
    ADD_RESTAURANT:'admin/restaurant/add_restaurant',
    LIST_OF_RESTAURANT:'admin/restaurant/list_of_restaurant',
    UPDATE_RESTAURANT:'admin/restaurant/restaurant_update',
    DELETE_RESTAURANT:'admin/restaurant/delete_restaurant',
    ADD_MENU:'admin/menu/add_menu',
    UPDATE_MENU:'admin/menu/menu_update',
    LIST_OF_MENU:'admin/menu/list_of_menu',
    DELETE_MENU:'admin/menu/delete_menu',
    LIST_OF_CMS_TYPE:'admin/cms_type/list_0f_cms_type',
    ADD_CMS:'admin/cms/add_cms',
    UPDATE_CMS:'admin/cms/update_cms',
    LIST_OF_CMS:'admin/cms/list_0f_cms',
    DELETE_CMS:'admin/cms/delete_cms',
    ADD_COUPONS:'admin/coupons/add_coupons',
    LIST_OF_COUPONS:'admin/coupons/list_of_coupons',
    COUPONS_UPDATE:'admin/coupons/coupons_update',
    DELETE_COUPONS:'admin/coupons/delete_coupons',
    ADD_TABLE:'admin/table/add_table',
    LIST_OF_TABLE:'admin/table/list_0f_table',
    UPDATE_TABLE:'admin/table/update_table',
    DELETE_TABLE:'admin/table/delete_table',
    RESTAURANT_BY_TABLE_LIST:'admin/table/restaurant_by_table_list',
    RESRAURANT_BY_MENU_LIST:'admin/menu/restaurant_by_menu_list',
    MENU_ITEMS_LIST:'admin/menu/menu_items_list',
    ADDNEWORDER:'admin/order/add_new_order',
    UPDATE_ORDER:'admin/order/order_update',
    ORDER_TRACK:'admin/order/order_track',
    ORDER_DETAILS:'admin/order/order_details',
    RESTAURANT_BY_ORDER_LIST:'admin/order/restaurant_by_order_list',
    LIST_OF_ORDERS:'admin/order/list_of_order',
    PAGINATED_LIST_OF_ORDERS: 'admin/order/paginated-list-of-orders',
    PAGINATED_LIST_OF_MENU: 'admin/menu/paginated-list-of-menu',
    DELETE_ORDER:'admin/order/delete_order',
    ADD_UPDATE_SYSTEM_OPTION:'admin/system_options/add_update_system_options',
    SYSTEM_OPTION_DETAILS:'admin/system_options/system_options_details',
    ADD_STOCK_TYPE:'admin/stock_type/add_stock_type',
    LIST_OF_STOCK_TYPE:'admin/stock_type/list_of_stock_type',
    UPDATE_STOCK_TYPE:'admin/stock_type/update_stock_type',
    DELETE_STOCK_TYPE:'admin/stock_type/delete_stock_type',
    ADD_INVENTORY:'admin/inventory/add_inventory',
    UPDATE_INVENTORY:'admin/inventory/update_inventory',
    LIST_OF_INVENTORY:'admin/inventory/list_of_inventory',
    DELETE_INVENTORY:'admin/inventory/delete_inventory',


    DASHBOARD:'admin/order/dashboard',

    /* { APPLICATION APIS } */
    USER_REGISTER:'user/register',
    USER_PROFILE_UPDATE:'user/profile_update',
    VALIDATE_PHONE_EMAIL:'user/validate_phone_email',
    VALIDATE_EMAIL:'user/validate_email',
    LIST_OF_USERS:'user/list_of_users',
    UPDATE_USER_DETAILS:'user/update_user_details',
    DELETE_USER:'user/delete_users',
}

const FILE_PATH = {
    PROFILE_IMAGE:'images/profile/',
    IDENTITY_PROOF_IMAGE:'images/proof/',
    CATEGORY_IMAGE:'images/category/',
    BANNER_IMAGE:'images/banner/'
 }
export {BASE_URL,FILE_URL,PATH,FILE_PATH}