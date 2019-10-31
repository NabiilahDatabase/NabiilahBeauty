export class Cart {
    id: string;
    jumlah: number;
}

export interface Product {
    id: string;
    nama: string;
    diskripsi: string;
    berat: number;
    stock: number;
    hargaJual: number;
    hargaBeli: number;
    hargaGold: number;
    hargaPlatinum: number;
    hargaSilver: number;
    img: []; keep: number;
  }

export interface Invoice {
    ekspedisi: { kurir: string; ongkir: number; service: string };
    id: string;
    penerima: {
      alamat: string;
      hp: string;
      kab: string;
      kec: string;
      nama: string;
      prov: string;
    };
    penerima_id: string;
    pengirim: { hp: string; nama: string };
    pesanan: Array<{
      hargaBeli: number;
      hargaJual: number;
      id: string;
      jumlah: number;
      nama: string;
    }>;
    berat: number;
    status: string;
    total: number;
    waktuOrder: number;
}
