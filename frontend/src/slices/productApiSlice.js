import { PRODUCT_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

///Giải thích providedtag và invalidatesTags
// invalildatesTags: khi 1 mutation invalidates 1 tag thì tất cả các query có tag đó refetch
export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword, pageNumber }) => ({
        // url: `${PRODUCT_URL}?pageNumber=${pageNumber}`
        url: `${PRODUCT_URL}`,
        params: {
          keyword,
          pageNumber,
        },
      }),
      keepUnUsedDataFor: 5,
      providesTags: ["Products"],
    }),
    getProductDetails: builder.query({
      query: (productId) => `${PRODUCT_URL}/${productId}`,
      keepUnUsedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: () => ({
        url: PRODUCT_URL,
        method: "POST",
      }),
      invalidatesTags: ["Product"],
    }),
    editProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.productId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: UPLOAD_URL,
        method: "POST",
        body: data,
      }),
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "DELETE",
      }),
    }),
    createProductReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    getTopProducts: builder.query({
      query: () => `${PRODUCT_URL}/top`,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useEditProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateProductReviewMutation,
  useGetTopProductsQuery,
} = productApiSlice;
