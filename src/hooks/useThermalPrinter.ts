import { useState, useCallback, useEffect } from 'react';
import { thermalPrinter, ReceiptData } from '@/services/thermalPrinter';
import { toast } from '@/hooks/use-toast';

export function useThermalPrinter() {
  const [isSupported, setIsSupported] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const checkSupport = async () => {
      const supported = await thermalPrinter.isSupported();
      setIsSupported(supported);
    };
    checkSupport();
  }, []);

  const connect = useCallback(async () => {
    try {
      const requested = await thermalPrinter.requestDevice();
      if (!requested) {
        toast({
          title: 'Erro',
          description: 'Nenhuma impressora selecionada',
          variant: 'destructive',
        });
        return false;
      }

      const connected = await thermalPrinter.connect();
      if (connected) {
        setIsConnected(true);
        setDeviceName(thermalPrinter.getDeviceName());
        toast({
          title: 'Impressora conectada',
          description: `Conectado a: ${thermalPrinter.getDeviceName() || 'Impressora USB'}`,
        });
        return true;
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível conectar à impressora',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Error connecting printer:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao conectar impressora',
        variant: 'destructive',
      });
      return false;
    }
  }, []);

  const disconnect = useCallback(async () => {
    await thermalPrinter.disconnect();
    setIsConnected(false);
    setDeviceName(null);
    toast({
      title: 'Impressora desconectada',
      description: 'A impressora foi desconectada',
    });
  }, []);

  const printReceipt = useCallback(async (data: ReceiptData) => {
    if (!isConnected) {
      toast({
        title: 'Erro',
        description: 'Impressora não conectada',
        variant: 'destructive',
      });
      return false;
    }

    setIsPrinting(true);
    try {
      await thermalPrinter.printReceipt(data);
      toast({
        title: 'Cupom impresso',
        description: 'O cupom foi impresso com sucesso',
      });
      return true;
    } catch (error) {
      console.error('Error printing receipt:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao imprimir cupom',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsPrinting(false);
    }
  }, [isConnected]);

  const printTestPage = useCallback(async () => {
    if (!isConnected) {
      toast({
        title: 'Erro',
        description: 'Impressora não conectada',
        variant: 'destructive',
      });
      return false;
    }

    setIsPrinting(true);
    try {
      await thermalPrinter.printTestPage();
      toast({
        title: 'Teste impresso',
        description: 'Página de teste impressa com sucesso',
      });
      return true;
    } catch (error) {
      console.error('Error printing test page:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao imprimir página de teste',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsPrinting(false);
    }
  }, [isConnected]);

  const openCashDrawer = useCallback(async () => {
    if (!isConnected) {
      toast({
        title: 'Erro',
        description: 'Impressora não conectada',
        variant: 'destructive',
      });
      return false;
    }

    try {
      await thermalPrinter.openCashDrawer();
      toast({
        title: 'Gaveta aberta',
        description: 'Comando enviado para abrir a gaveta',
      });
      return true;
    } catch (error) {
      console.error('Error opening cash drawer:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao abrir gaveta',
        variant: 'destructive',
      });
      return false;
    }
  }, [isConnected]);

  return {
    isSupported,
    isConnected,
    deviceName,
    isPrinting,
    connect,
    disconnect,
    printReceipt,
    printTestPage,
    openCashDrawer,
  };
}
