import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useSupabaseStore = () => {
  const { setCurrentOperator } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [operatorData, setOperatorData] = useState(null);

  // Authentication disabled - no operator data loading needed for admin mode

  const sendNotification = async (operatorId: string, title: string, message: string, type: 'shift_assignment' | 'shift_update' | 'shift_cancellation', eventId?: string, shiftId?: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-push-notification', {
        body: {
          operatorId,
          title,
          body: message,
          type,
          eventId,
          shiftId
        }
      });

      if (error) {
        console.error('Error sending notification:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error invoking notification function:', error);
      return false;
    }
  };

  return {
    loading,
    operatorData,
    sendNotification
  };
};