"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { importe, maximo, paso, type Catalogo, type Producto } from "./catalogo";

/**
 * Carrito de la tienda.
 *
 * Se guarda en el navegador (localStorage): sobrevive a recargar la página y
 * se comparte entre pestañas, así un cliente puede abrir productos en otra
 * pestaña, agregarlos ahí y verlos en el carrito de la primera.
 */
const CLAVE = "pack-carrito-v1";

/** Lo que el carrito recuerda de cada producto, para mostrarlo sin pedir el catálogo. */
export type ProductoEnCarrito = Pick<
  Producto,
  "id" | "slug" | "nombre" | "precio" | "porPeso" | "unidad" | "stock" | "categoria"
> & { imagen: string | null };

export interface Renglon {
  producto: ProductoEnCarrito;
  /** Unidades, o gramos si el producto es por peso. */
  cantidad: number;
}

export interface CambioDeCarrito {
  nombre: string;
  detalle: string;
}

interface CarritoCtx {
  /** Ya se leyó el carrito guardado en el navegador. */
  cargado: boolean;
  renglones: Renglon[];
  cantidadProductos: number;
  subtotal: number;
  cantidadDe: (id: string) => number;
  agregar: (p: Producto, cantidad?: number) => void;
  setCantidad: (id: string, cantidad: number) => void;
  quitar: (id: string) => void;
  vaciar: () => void;
  /** Pone precios y stock al día con el catálogo; devuelve qué cambió. */
  sincronizar: (catalogo: Catalogo) => CambioDeCarrito[];
  abierto: boolean;
  abrir: () => void;
  cerrar: () => void;
}

const Ctx = createContext<CarritoCtx | null>(null);

function aEnCarrito(p: Producto): ProductoEnCarrito {
  return {
    id: p.id,
    slug: p.slug,
    nombre: p.nombre,
    precio: p.precio,
    porPeso: p.porPeso,
    unidad: p.unidad,
    stock: p.stock,
    categoria: p.categoria,
    imagen: p.imagenes[0] ?? null,
  };
}

function leer(): Renglon[] {
  try {
    const crudo = JSON.parse(localStorage.getItem(CLAVE) ?? "[]");
    return Array.isArray(crudo)
      ? crudo.filter((r) => r && r.producto && typeof r.producto.id === "string" && r.cantidad > 0)
      : [];
  } catch {
    return [];
  }
}

// ---- El carrito guardado en el navegador, como "store" externo de React ----

const VACIO: Renglon[] = [];
let guardado: Renglon[] | null = null;
const oyentes = new Set<() => void>();

function avisar() {
  for (const o of oyentes) o();
}

function suscribir(oyente: () => void) {
  oyentes.add(oyente);
  // Si otra pestaña cambia el carrito, esta lo vuelve a leer.
  const alCambiarEnOtraPestana = (e: StorageEvent) => {
    if (e.key !== CLAVE) return;
    guardado = leer();
    avisar();
  };
  window.addEventListener("storage", alCambiarEnOtraPestana);
  return () => {
    oyentes.delete(oyente);
    window.removeEventListener("storage", alCambiarEnOtraPestana);
  };
}

function leerActual(): Renglon[] {
  guardado ??= leer();
  return guardado;
}

function escribir(siguiente: Renglon[]) {
  guardado = siguiente;
  try {
    localStorage.setItem(CLAVE, JSON.stringify(siguiente));
  } catch {
    // Navegación privada o almacenamiento lleno: el carrito sigue andando en esta pestaña.
  }
  avisar();
}

function actualizar(cambio: (prev: Renglon[]) => Renglon[]) {
  escribir(cambio(leerActual()));
}

const sinSuscripcion = () => () => {};

/** Redondea al paso del producto y respeta el stock. */
function acotar(p: Pick<Producto, "porPeso" | "stock">, cantidad: number): number {
  const s = paso(p);
  const tope = Math.floor(maximo(p) / s) * s;
  return Math.max(0, Math.min(Math.round(cantidad / s) * s, tope));
}

export function CarritoProvider({ children }: { children: React.ReactNode }) {
  // En el servidor (y en el primer render del navegador) el carrito está vacío;
  // enseguida se lee lo guardado. `cargado` dice si eso ya pasó.
  const renglones = useSyncExternalStore(suscribir, leerActual, () => VACIO);
  const cargado = useSyncExternalStore(sinSuscripcion, () => true, () => false);
  const [abierto, setAbierto] = useState(false);

  const cantidadDe = useCallback(
    (id: string) => renglones.find((r) => r.producto.id === id)?.cantidad ?? 0,
    [renglones]
  );

  const agregar = useCallback((p: Producto, cantidad = paso(p)) => {
    actualizar((prev) => {
      const actual = prev.find((r) => r.producto.id === p.id);
      const nueva = acotar(p, (actual?.cantidad ?? 0) + cantidad);
      if (nueva <= 0) return prev;
      if (actual) return prev.map((r) => (r.producto.id === p.id ? { producto: aEnCarrito(p), cantidad: nueva } : r));
      return [...prev, { producto: aEnCarrito(p), cantidad: nueva }];
    });
  }, []);

  const setCantidad = useCallback((id: string, cantidad: number) => {
    actualizar((prev) =>
      prev.flatMap((r) => {
        if (r.producto.id !== id) return [r];
        const nueva = acotar(r.producto, cantidad);
        return nueva > 0 ? [{ ...r, cantidad: nueva }] : [];
      })
    );
  }, []);

  const quitar = useCallback((id: string) => actualizar((prev) => prev.filter((r) => r.producto.id !== id)), []);
  const vaciar = useCallback(() => escribir([]), []);
  const abrir = useCallback(() => setAbierto(true), []);
  const cerrar = useCallback(() => setAbierto(false), []);

  const sincronizar = useCallback((catalogo: Catalogo) => {
    const cambios: CambioDeCarrito[] = [];
    const siguiente = leerActual().flatMap((r) => {
      const p = catalogo.productos.find((x) => x.id === r.producto.id);
      if (!p || !p.disponible) {
        cambios.push({ nombre: r.producto.nombre, detalle: "ya no está disponible y se sacó del carrito" });
        return [];
      }
      const cantidad = acotar(p, r.cantidad);
      if (cantidad <= 0) {
        cambios.push({ nombre: p.nombre, detalle: "se quedó sin stock y se sacó del carrito" });
        return [];
      }
      if (cantidad < r.cantidad) cambios.push({ nombre: p.nombre, detalle: "tiene menos stock: se ajustó la cantidad" });
      if (p.precio !== r.producto.precio) cambios.push({ nombre: p.nombre, detalle: "cambió de precio" });
      return [{ producto: aEnCarrito(p), cantidad }];
    });
    escribir(siguiente);
    return cambios;
  }, []);

  const valor = useMemo<CarritoCtx>(
    () => ({
      cargado,
      renglones,
      cantidadProductos: renglones.length,
      subtotal: renglones.reduce((s, r) => s + importe(r.producto, r.cantidad), 0),
      cantidadDe,
      agregar,
      setCantidad,
      quitar,
      vaciar,
      sincronizar,
      abierto,
      abrir,
      cerrar,
    }),
    [cargado, renglones, cantidadDe, agregar, setCantidad, quitar, vaciar, sincronizar, abierto, abrir, cerrar]
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useCarrito(): CarritoCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCarrito tiene que usarse dentro de <CarritoProvider>");
  return ctx;
}
