import { commonObjWithOtherType } from "../type";

export function getInitParams() {
  const params = new URLSearchParams(window.location.search);
  const limit = params.get("limit");
  const sort = params.get("sort");
  const search = params.get("search");
  const category1 = params.get("category1");
  const category2 = params.get("category2");
  const allAarams = {
    ...(limit ? { limit } : {}),
    ...(sort ? { sort } : {}),
    ...(search ? { search } : {}),
    ...(category1 ? { category1 } : {}),
    ...(category2 ? { category2 } : {}),
  };

  return allAarams;
}

export function getParams(obj?: commonObjWithOtherType) {
  let params = "";

  if (obj) {
    const entries = Object.entries(obj)
      .map(([k, v]): [string, string] => [k, String(v)])
      .filter((item) => (item[1] ?? "").length > 0);
    params = new URLSearchParams(entries).toString();
  }

  return params;
}
