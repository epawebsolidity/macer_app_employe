import api from "../utils/axiosAuth";

export const createWalletUser = async (id_users: number, address_wallet: string) => {
    try {
        const res = await api.post("/wallet", {
            id_users,
            address_wallet,
        });
        console.log("Wallet created:", res.data);
        return res.data;
    } catch (error) {
        console.error("Error creating wallet:", error);
        return null;
    }
};

export const getWalletByUserId = async (id_users: number) => {
    try {
        const res = await api.get(`/wallet/${id_users}`);
        const rows = res.data.data;
        if (!rows || rows.length === 0) return null;
        return rows[0];
    } catch (error) {
        console.error("Error fetching wallet data:", error);
        return null;
    }
};


export const deleteWalletUser = async (id_users: number) => {
    try {
        const res = await api.delete(`/wallet/${id_users}`);
        console.log(res);
    } catch (error) {
        console.error("Error deleting wallet:", error);
        return null;
    }
}
