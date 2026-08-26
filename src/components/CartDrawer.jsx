import { ShoppingBag, AlertCircle, Loader2, RotateCcw } from "lucide-react";
import CartLine from "./CartLine";
import { formatPrice } from "./Constants";

/* ------------------------------- CartDrawer ---------------------------------- */
export default function CartDrawer({
  open, cart, tableNumber, subtotal, tax, total, onClose,
  onInc, onDec, onNotes, onRemove, onPlaceOrder, submitting, error, t,
}) {
  if (!open) return null;
  const empty = cart.length === 0;

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet cart-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={t?.order || "Your order"}>
        <div className="sheet-drag" />
          <div className="cart-header">
            <h2>{t?.order || "Your Order"}</h2>
            <span className="table-chip">{t?.table || "Table"} {tableNumber}</span>
          </div>

        <div className="cart-lines">
          {empty ? (
            <div className="empty-cart">
              <ShoppingBag size={28} strokeWidth={1.3} />
              <p>{t?.emptyCart || "Your order is empty."}</p>
              <span>{t?.emptyCartHint || "Tap any dish to add it here."}</span>
            </div>
          ) : (
            cart.map((line) => (
              <CartLine
                key={line.id}
                line={line}
                onInc={onInc}
                onDec={onDec}
                onNotes={onNotes}
                onRemove={onRemove}
                t={t}
              />
            ))
          )}
        </div>

        {!empty && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span>{t?.subtotal || "Subtotal"}</span>
              <span className="mono">{formatPrice(subtotal)}</span>
            </div>
            <div className="cart-summary-row cart-summary-row-sub">
              <span>{t?.tax || "Tax & service (9%)"}</span>
              <span className="mono">{formatPrice(tax)}</span>
            </div>
            <div className="cart-summary-row cart-summary-row-total">
              <span>{t?.total || "Total"}</span>
              <span className="mono">{formatPrice(total)}</span>
            </div>

            {error && (
              <div className="order-error" role="alert">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="button"
              className="primary-btn wide"
              onClick={onPlaceOrder}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="spin" /> {t?.sending || "Sending to kitchen…"}
                </>
              ) : error ? (
                <>
                  <RotateCcw size={16} /> {t?.retry || "Retry"} &nbsp;·&nbsp; {formatPrice(total)}
                </>
              ) : (
                <>{t?.confirm || "Confirm Order"} &nbsp;·&nbsp; {formatPrice(total)}</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}