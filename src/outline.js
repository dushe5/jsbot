import {} from "dotenv/config";
import axios from "axios";
import * as https from "https";

class Outline {
  constructor(API_URL) {
    this.API_URL = API_URL;
  }

  async createNewKey() {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    return axios.post(
      this.API_URL + "/access-keys",
      {
        method: "chacha20-ietf-poly1305",
      },
      { httpsAgent }
    );
  }

  async renameKey(id, newName) {
    console.log(`/access-keys/${id}/name/${newName}`)
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    return axios.put(
      this.API_URL + `/access-keys/${id}/name`,
      {
        name: newName,
      },
      { httpsAgent }
    );
  }

  async changeDataLimit(id, newDataLimit) {
    console.log(`/access-keys/${id}/data-limit/${newDataLimit}`)
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    return axios.put(
      this.API_URL + `/access-keys/${id}/data-limit`,
      {
        'limit': {
          'bytes': Number(newDataLimit) * Math.pow(10, 9),
        },
      },
      { httpsAgent }
    );
  }

  async getAllDataTransfer() {
    let AllDataTransfer = "";
    return AllDataTransfer;
  }

  async getUserDataTransfer(userId) {
    let UserDataTransfer = "";
    return UserDataTransfer;
  }
}

export const VPN = new Outline(process.env.OUTLINE_API_URL);
