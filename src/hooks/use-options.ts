import { useState, useEffect, useCallback } from 'react';
import { OptionService, WorkspaceOption } from '@/services/options.service';

export function useOptions() {
  const [allOptions, setAllOptions] = useState<WorkspaceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshOptions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await OptionService.fetchOptions();
      setAllOptions(data);
    } catch (err: any) {
      console.error("[useOptions] Fetch error:", {
        message: err.message,
        code: err.code,
        details: err.details,
        hint: err.hint
      });
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshOptions();
  }, [refreshOptions]);

  const getByCategory = useCallback((category: string) => {
    return allOptions.filter(opt => opt.category === category);
  }, [allOptions]);

  const addOption = async (option: Omit<WorkspaceOption, 'id' | 'is_system'>) => {
    const newOpt = await OptionService.createOption(option);
    setAllOptions(prev => [...prev, newOpt].sort((a, b) => a.order_index - b.order_index));
    return newOpt;
  };

  const updateOption = async (id: string, updates: Partial<WorkspaceOption>) => {
    const updated = await OptionService.updateOption(id, updates);
    setAllOptions(prev => prev.map(opt => opt.id === id ? updated : opt).sort((a, b) => a.order_index - b.order_index));
    return updated;
  };

  const deleteOption = async (id: string) => {
    await OptionService.deleteOption(id);
    setAllOptions(prev => prev.filter(opt => opt.id !== id));
  };

  return {
    allOptions,
    loading,
    error,
    getByCategory,
    addOption,
    updateOption,
    deleteOption,
    refreshOptions
  };
}
