import $http from "./axios";

export const getVideoById = async (id) => await $http.get(`/video/get/${id}`);
