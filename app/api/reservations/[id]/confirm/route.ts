import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const p = prisma as any

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const reservationId = params.id;

    if (!reservationId) {
      return NextResponse.json(
        { error: "Reservation ID is required." },
        { status: 400 }
      );
    }

    const result = await p.$transaction(async (tx: any) => {
      const reservation = await tx.reservation.findUnique({
        where: { id: reservationId },
      });

      if (!reservation) {
        return { error: 'Reservation not found.', status: 404 }
      }

      if (reservation.expiresAt <= new Date()) {
        return { error: 'Reservation has expired.', status: 410 }
      }

      if (reservation.status !== 'PENDING') {
        return { error: `Reservation already ${reservation.status}.`, status: 400 }
      }

      // Lock inventory row to avoid races
      const inventories = await tx.$queryRaw<
        { id: string; totalStock: number; reservedStock: number }[]
      >`
        SELECT "id", "totalStock", "reservedStock"
        FROM "Inventory"
        WHERE "id" = ${reservation.inventoryId}
        FOR UPDATE
      `

      const inventory = inventories[0]

      if (!inventory) {
        return { error: 'Associated inventory not found.', status: 404 }
      }

      // Compute new stock values, preventing negatives
      const newReserved = Math.max(0, inventory.reservedStock - reservation.quantity)
      const newTotal = Math.max(0, inventory.totalStock - reservation.quantity)

      const [_, updatedReservation] = await Promise.all([
        tx.inventory.update({
          where: { id: inventory.id },
          data: {
            reservedStock: newReserved,
            totalStock: newTotal,
          },
        }),
        tx.reservation.update({
          where: { id: reservationId },
          data: { status: 'CONFIRMED' },
        }),
      ])

      return { data: updatedReservation, status: 200 }
    }, { timeout: 10000 })

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json(result.data);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}