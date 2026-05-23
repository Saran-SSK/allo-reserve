import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

    const result = await prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: {
          id: reservationId,
        },
      });

      if (!reservation) {
        return {
          error: "Reservation not found.",
          status: 404,
        };
      }

      if (reservation.expiresAt <= new Date()) {
        return {
          error: "Reservation has expired.",
          status: 410,
        };
      }

      if (
        reservation.status === "CONFIRMED" ||
        reservation.status === "RELEASED"
      ) {
        return {
          error: `Reservation already ${reservation.status}.`,
          status: 400,
        };
      }

      const updatedReservation = await tx.reservation.update({
        where: {
          id: reservationId,
        },
        data: {
          status: "CONFIRMED",
        },
      });

      return {
        data: updatedReservation,
        status: 200,
      };
    });

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