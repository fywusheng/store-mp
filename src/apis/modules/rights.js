
import { request } from "@/apis/request";

export default {
  // 个人权益json串
  getIndividualRights: function(args = {}) {
    request({
      url: "/cms/iep/web/cms/cmscont/getIndividualRights",
      ...args,
    });
  },
  
};


