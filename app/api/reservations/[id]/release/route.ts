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
      })

      if (!reservation) {
        return { error: 'Reservation not found.', status: 404 }
      }

      if (reservation.status === 'RELEASED') {
        return { error: 'Reservation already released.', status: 400 }
      }

      // Lock inventory for update
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

      // If pending: release reserved stock back to available (decrement reserved)
      // If confirmed: the reservation already consumed totalStock on confirm,
      // so releasing a confirmed reservation should restore totalStock.
      if (reservation.status === 'PENDING') {
        const updatedReservedStock = Math.max(0, inventory.reservedStock - reservation.quantity)

        await tx.inventory.update({
          where: { id: inventory.id },
          data: { reservedStock: updatedReservedStock },
        })
      } else if (reservation.status === 'CONFIRMED') {
        const updatedTotalStock = inventory.totalStock + reservation.quantity

        await tx.inventory.update({
          where: { id: inventory.id },
          data: { totalStock: updatedTotalStock },
        })
      }

      const updatedReservation = await tx.reservation.update({
        where: { id: reservationId },
        data: { status: 'RELEASED' },
      })

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