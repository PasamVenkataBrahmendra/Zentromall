'use client';

import { useComparison } from '@/context/ComparisonContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './ProductComparison.module.css';

export default function ProductComparison() {
  const { comparisonList, removeFromComparison, clearComparison } = useComparison();
  const router = useRouter();

  if (comparisonList.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📊</div>
        <h3>No Products to Compare</h3>
        <p>Add products from shop to compare their features and prices</p>
        <button onClick={() => router.push('/shop')} className={styles.shopBtn}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Product Comparison</h2>
        <button onClick={clearComparison} className={styles.clearBtn}>
          Clear All
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.labelCol}>Specifications</th>
              {comparisonList.map((product) => (
                <th key={product._id} className={styles.productCol}>
                  <div className={styles.productHeader}>
                    {product.images && product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className={styles.thumbnail}
                      />
                    )}
                    <div className={styles.productInfo}>
                      <h4>{product.title}</h4>
                      <p className={styles.price}>
                        ₹{product.price?.toFixed(2)}
                      </p>
                      {product.rating && (
                        <p className={styles.rating}>
                          ⭐ {product.rating} / 5
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromComparison(product._id)}
                      className={styles.removeBtn}
                      title="Remove from comparison"
                    >
                      ✕
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Price Comparison */}
            <tr>
              <td className={styles.label}>Price</td>
              {comparisonList.map((product) => (
                <td key={product._id} className={styles.value}>
                  <div className={styles.price}>
                    ₹{product.price?.toFixed(2)}
                  </div>
                  {product.mrp && product.mrp > product.price && (
                    <div className={styles.original}>
                      <span className={styles.strikethrough}>
                        ₹{product.mrp.toFixed(2)}
                      </span>
                      <span className={styles.discount}>
                        {Math.round(
                          ((product.mrp - product.price) / product.mrp) * 100
                        )}
                        % off
                      </span>
                    </div>
                  )}
                </td>
              ))}
            </tr>

            {/* Stock Status */}
            <tr>
              <td className={styles.label}>Availability</td>
              {comparisonList.map((product) => (
                <td key={product._id} className={styles.value}>
                  {product.stock > 0 ? (
                    <span className={styles.inStock}>✓ In Stock</span>
                  ) : (
                    <span className={styles.outOfStock}>Out of Stock</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Rating */}
            <tr>
              <td className={styles.label}>Rating</td>
              {comparisonList.map((product) => (
                <td key={product._id} className={styles.value}>
                  <div className={styles.ratingInfo}>
                    <span className={styles.rating}>⭐ {product.rating || 0}</span>
                    <span className={styles.reviews}>
                      {product.numReviews || 0} reviews
                    </span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Category */}
            <tr>
              <td className={styles.label}>Category</td>
              {comparisonList.map((product) => (
                <td key={product._id} className={styles.value}>
                  {product.category || 'N/A'}
                </td>
              ))}
            </tr>

            {/* Description */}
            <tr>
              <td className={styles.label}>Description</td>
              {comparisonList.map((product) => (
                <td key={product._id} className={styles.value}>
                  <p className={styles.description}>
                    {product.description || 'No description available'}
                  </p>
                </td>
              ))}
            </tr>

            {/* Features/Specifications */}
            {comparisonList[0]?.specifications && (
              <tr>
                <td className={styles.label}>Specifications</td>
                {comparisonList.map((product) => (
                  <td key={product._id} className={styles.value}>
                    {product.specifications && typeof product.specifications === 'object' ? (
                      <ul className={styles.specsList}>
                        {Object.entries(product.specifications).map(
                          ([key, value]) => (
                            <li key={key}>
                              <strong>{key}:</strong> {value}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      'N/A'
                    )}
                  </td>
                ))}
              </tr>
            )}

            {/* Action Row */}
            <tr className={styles.actionRow}>
              <td className={styles.label}></td>
              {comparisonList.map((product) => (
                <td key={product._id} className={styles.value}>
                  <Link
                    href={`/product/${product.slug}`}
                    className={styles.viewBtn}
                  >
                    View Details
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className={styles.mobileView}>
        {comparisonList.map((product) => (
          <div key={product._id} className={styles.mobileCard}>
            <div className={styles.cardHeader}>
              {product.images && product.images[0] && (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className={styles.cardImage}
                />
              )}
              <button
                onClick={() => removeFromComparison(product._id)}
                className={styles.removeBtn}
              >
                ✕
              </button>
            </div>

            <h3>{product.title}</h3>
            <p className={styles.price}>₹{product.price?.toFixed(2)}</p>

            <div className={styles.cardDetails}>
              <div className={styles.detail}>
                <label>Stock:</label>
                {product.stock > 0 ? (
                  <span className={styles.inStock}>In Stock</span>
                ) : (
                  <span className={styles.outOfStock}>Out of Stock</span>
                )}
              </div>
              <div className={styles.detail}>
                <label>Rating:</label>
                <span>⭐ {product.rating || 0}</span>
              </div>
              <div className={styles.detail}>
                <label>Category:</label>
                <span>{product.category || 'N/A'}</span>
              </div>
            </div>

            <Link
              href={`/product/${product.slug}`}
              className={styles.viewBtn}
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
