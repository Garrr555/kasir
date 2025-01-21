interface CardProps {
  image: string;
  name: string;
  price: number;
  onSelect: (item: { name: string; image: string; price: number }) => void;
  onItem: number;
  onDelete: (item: { name: string; image: string; price: number }) => void;
}

export default function Card(props: CardProps) {
  const { image, name, price, onSelect, onItem, onDelete } = props;

  const handleClick = () => {
    onSelect({ name, image, price }); // Memanggil onSelect saat kartu diklik
  };

  const handleDelete = () => {
    onDelete({name, image, price,})
  }
  return (
    <div className="card bg-base-100 w-96 shadow-xl my-3 cursor-pointer">
      <figure>
        <img src={image} alt="Shoes" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
        <div className="card-actions justify-end">
          <button className="btn btn-accent text-white" onClick={handleClick}>
            Rp. {price}
          </button>
        </div>
      </div>

      {/* Tombol untuk mengurangi jumlah item */}
      <div className="absolute bottom-0 left-0 flex gap-2 p-2">
        <button
          className="btn btn-error btn-outline"
          onClick={handleDelete} // Mengurangi jumlah item
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
