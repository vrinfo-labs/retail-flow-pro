import { Printer, Wifi, WifiOff, TestTube, DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThermalPrinter } from "@/hooks/useThermalPrinter";
import { cn } from "@/lib/utils";

interface PrinterStatusProps {
  compact?: boolean;
}

export function PrinterStatus({ compact = false }: PrinterStatusProps) {
  const {
    isSupported,
    isConnected,
    deviceName,
    isPrinting,
    connect,
    disconnect,
    printTestPage,
    openCashDrawer,
  } = useThermalPrinter();

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-warning/10 text-warning text-sm">
        <WifiOff className="h-4 w-4" />
        <span>Web USB não suportado neste navegador</span>
      </div>
    );
  }

  if (compact) {
    return (
      <button
        onClick={isConnected ? disconnect : connect}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          isConnected
            ? "bg-accent/10 text-accent hover:bg-accent/20"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        )}
      >
        {isConnected ? (
          <>
            <Wifi className="h-4 w-4" />
            <span className="hidden sm:inline">
              {deviceName || "Impressora"}
            </span>
          </>
        ) : (
          <>
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Conectar</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div className="rounded-xl bg-card border border-border/50 shadow-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center",
              isConnected
                ? "bg-accent/10 text-accent"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Printer className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Impressora Térmica</h3>
            <p
              className={cn(
                "text-sm",
                isConnected ? "text-accent" : "text-muted-foreground"
              )}
            >
              {isConnected
                ? deviceName || "Conectada"
                : "Não conectada"}
            </p>
          </div>
        </div>
        <div
          className={cn(
            "h-3 w-3 rounded-full",
            isConnected ? "bg-accent animate-pulse" : "bg-muted-foreground"
          )}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {!isConnected ? (
          <Button
            variant="outline"
            size="sm"
            onClick={connect}
            className="flex-1"
          >
            <Wifi className="h-4 w-4 mr-2" />
            Conectar
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={printTestPage}
              disabled={isPrinting}
            >
              <TestTube className="h-4 w-4 mr-2" />
              Teste
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openCashDrawer}
              disabled={isPrinting}
            >
              <DoorOpen className="h-4 w-4 mr-2" />
              Gaveta
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={disconnect}
              className="text-destructive hover:text-destructive"
            >
              <WifiOff className="h-4 w-4 mr-2" />
              Desconectar
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
