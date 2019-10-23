export class Cart {
    id: string;
    jumlah: number;
}

export interface Product {
    id: string;
    nama: string;
    berat: number;
    stock: number;
    hargaJual: number;
    hargaBeli: number;
    hargaGold: number;
    hargaPlatinum: number;
    hargaSilver: number;
    img: [];
  }

export interface Invoice {
    cs: string;
    cs_id: string;
    deposit: number;
    diskon: number;
    dropshiper: { hp: string; id: string; nama: string };
    ekspedisi: { kurir: string; ongkir: number; service: string };
    hutang: number;
    id: string;
    ninggal: number;
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
      barcode: string;
      berat: number;
      diskon: number;
      hargaBeli: number;
      hargaJual: number;
      id: string;
      indexWarna: number;
      jumlah: number;
      kodeProses: string;
      nama: string;
      status: string;
      toko: string;
      type: string;
      waktuKeep: number;
      warna: string
    }>;
    status: string;
    total: number;
    waktuKeep: number;
}
