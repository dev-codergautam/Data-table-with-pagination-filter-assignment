import { URL_STRING } from "../const/Api";

const headers = {
  "Content-type": "application/json",
};

// GET ALL LAUNCH DATA
export const getLaunchList = async () => {
  const response = await fetch(`${URL_STRING}launches`, {
    method: "get",
    headers,
  });
  const data = await response.json();
  return data;
};

// GET LIMITED LAUNCH DATA
export const getLimitLaunchList = async (limit, offset) => {
  console.log(limit, offset);
  const response = await fetch(
    `${URL_STRING}launches?limit=${limit}&&offset=${offset}`,
    {
      method: "get",
      headers,
    }
  );
  const data = await response.json();
  return data;
};

// GET PARTICULAR LAUNCH DATA
export const getParticularLaunch = async (id) => {
  const response = await fetch(`${URL_STRING}launches/${id}`, {
    method: "get",
    headers,
  });
  const data = await response.json();
  return data;
};

// GET PARTICULAR LAUNCH DATA
export const getLaunchSuccess = async (launch_status) => {
  console.log(launch_status);
  const response = await fetch(
    `${URL_STRING}launches?launch_success=${launch_status}`,
    {
      method: "get",
      headers,
    }
  );
  const data = await response.json();
  return data;
};

// GET PARTICULAR LAUNCH DATA
export const getUpcomingLaunch = async () => {
  const response = await fetch(`${URL_STRING}launches/upcoming`, {
    method: "get",
    headers,
  });
  const data = await response.json();
  return data;
};
