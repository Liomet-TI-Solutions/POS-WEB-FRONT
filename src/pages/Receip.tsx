interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

interface ReceiptProps {
  items: ReceiptItem[];
  subtotal: number;
  discount: number;
  total: number;
  payment: number;
  change: number;
  cashier: string;
  ticketNumber: string;
}

export function Receipt({
  items,
  subtotal,
  discount,
  total,
  payment,
  change,
  cashier,
  ticketNumber,
}: ReceiptProps) {
  const now = new Date().toLocaleString();

  return (
    <div
      id="receipt"
      className="w-[300px] text-sm font-mono p-4 bg-white"
    >
      <div className="text-center">
        <h2 className="font-bold text-lg">TIENDA LÓPEZ</h2>
        <p>RFC: XAXX010101000</p>
        <p>Av. Siempre Viva #123</p>
        <p>Tel: 555-123-4567</p>
      </div>

      <hr className="my-2" />

      <p>Ticket: {ticketNumber}</p>
      <p>Fecha: {now}</p>
      <p>Cajero: {cashier}</p>

      <hr className="my-2" />

      {items.map((item, index) => (
        <div key={index} className="flex justify-between">
          <span>
            {item.quantity} {item.name}
          </span>
          <span>
            ${(item.quantity * item.price).toFixed(2)}
          </span>
        </div>
      ))}

      <hr className="my-2" />

      <div className="flex justify-between">
        <span>Subtotal:</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between">
        <span>Descuento:</span>
        <span>-${discount.toFixed(2)}</span>
      </div>

      <hr className="my-2" />

      <div className="flex justify-between font-bold text-base">
        <span>TOTAL:</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <div className="flex justify-between">
        <span>Pago:</span>
        <span>${payment.toFixed(2)}</span>
      </div>

      <div className="flex justify-between">
        <span>Cambio:</span>
        <span>${change.toFixed(2)}</span>
      </div>

      <hr className="my-2" />

      <div className="text-center text-xs mt-2">
        <p>¡Gracias por su compra!</p>
        <p>No hay devoluciones sin ticket</p>
      </div>
    </div>
  );
}
