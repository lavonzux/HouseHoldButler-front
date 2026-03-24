import type { ApiInventory, InventoryItem, InventoryStatus } from '@/types'

/**
 * 將後端 ApiInventory 轉換為前端 InventoryItem
 */
export function mapApiInventoryToItem(inv: ApiInventory): InventoryItem {
  const daysUntilEmpty = inv.estimatedDepletionDate
    ? Math.max(0, Math.ceil(
        (new Date(inv.estimatedDepletionDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      ))
    : 0

  let status: InventoryStatus
  if (inv.status === 'DEPLETED' || inv.status === 'EXPIRED') {
    status = 'critical'
  } else if (daysUntilEmpty <= 3) {
    status = 'critical'
  } else if (daysUntilEmpty <= 7) {
    status = 'warning'
  } else {
    status = 'ok'
  }

  return {
    id: inv.id,
    key: inv.id,
    name: inv.product.name,
    category: inv.product.category?.name ?? '未分類',
    quantity: Math.round(inv.currentQuantity * inv.initialQuantity * 100) / 100,
    unit: inv.product.unit ?? '個',
    consumptionRate: inv.product.avgConsumptionRate * inv.initialQuantity,
    daysUntilEmpty,
    expiryDate: inv.nearestExpiryDate,
    location: inv.location ?? '',
    lastUpdated: inv.updatedAt,
    status,
  }
}
