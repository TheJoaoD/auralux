'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSaleWizardStore } from '@/lib/stores/saleWizardStore'
import { getAllCustomers } from '@/lib/services/customerService'
import { AddCustomerModal } from '@/components/customers/AddCustomerModal'
import { Check, ChevronsUpDown, UserPlus, User, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { formatWhatsApp } from '@/lib/utils/formatters'

export function CustomerSelectionStep() {
  const [open, setOpen] = useState(false)
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)
  const {
    selectedCustomer,
    setCustomer,
    goToStep,
    canGoToStep,
  } = useSaleWizardStore()

  // Fetch all customers (no pagination for selector)
  const { data: customers, isLoading } = useQuery({
    queryKey: ['all-customers'],
    queryFn: getAllCustomers,
    staleTime: 30000,
  })

  const handleSelectCustomer = (customerId: string) => {
    const customer = customers?.find((c) => c.id === customerId)
    if (customer) {
      setCustomer(customer)
      setOpen(false)
    }
  }

  const handleAddNewCustomer = () => {
    setOpen(false)
    setIsAddCustomerOpen(true)
  }

  const handleCustomerCreated = (newCustomer: any) => {
    setCustomer(newCustomer)
    setIsAddCustomerOpen(false)
  }

  const handleNext = () => {
    if (canGoToStep(2)) {
      goToStep(2)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-[#202020] mb-2">
          Selecione o Cliente
        </h3>
        <p className="text-sm text-[#A1887F]">
          Escolha o cliente que está realizando a compra
        </p>
      </div>

      {/* Customer Selector */}
      <div className="space-y-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 bg-white border-2 rounded-lg transition-all min-h-[56px]",
                selectedCustomer
                  ? "border-[#C49A9A] text-[#202020]"
                  : "border-[#A1887F]/30 text-[#A1887F] hover:border-[#A1887F]"
              )}
            >
              <div className="flex-1 text-left truncate">
                {selectedCustomer ? (
                  <>
                    <p className="font-medium truncate">{selectedCustomer.full_name}</p>
                    {selectedCustomer.whatsapp && (
                      <p className="text-sm text-[#A1887F] flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {formatWhatsApp(selectedCustomer.whatsapp)}
                      </p>
                    )}
                  </>
                ) : (
                  "Buscar cliente..."
                )}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[var(--radix-popover-trigger-width)] p-0" align="start">
            <Command className="bg-white">
              <CommandInput
                placeholder="Buscar por nome ou WhatsApp..."
                className="border-none focus:ring-0"
              />
              <CommandList>
                <CommandEmpty>
                  <div className="py-6 text-center">
                    <p className="text-sm text-[#A1887F] mb-4">
                      Nenhum cliente encontrado
                    </p>
                    <button
                      onClick={handleAddNewCustomer}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] font-medium rounded-lg transition-colors"
                    >
                      <UserPlus className="h-4 w-4" />
                      Cadastrar Novo Cliente
                    </button>
                  </div>
                </CommandEmpty>
                <CommandGroup>
                  {/* Add New Customer Option */}
                  <CommandItem
                    value="__new__"
                    onSelect={handleAddNewCustomer}
                    className="flex items-center gap-3 py-3 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#C49A9A] flex items-center justify-center">
                      <UserPlus className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#C49A9A]">
                        + Novo Cliente
                      </p>
                      <p className="text-xs text-[#A1887F]">
                        Cadastrar novo cliente
                      </p>
                    </div>
                  </CommandItem>

                  {/* Customer List */}
                  {customers?.map((customer) => (
                    <CommandItem
                      key={customer.id}
                      value={`${customer.full_name} ${customer.whatsapp || ''}`}
                      onSelect={() => handleSelectCustomer(customer.id)}
                      className="flex items-center gap-3 py-3 cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#A1887F] flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#202020] truncate">
                          {customer.full_name}
                        </p>
                        {customer.whatsapp && (
                          <p className="text-sm text-[#A1887F] flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {formatWhatsApp(customer.whatsapp)}
                          </p>
                        )}
                      </div>
                      <Check
                        className={cn(
                          "h-5 w-5",
                          selectedCustomer?.id === customer.id
                            ? "text-[#C49A9A] opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-4">
            <p className="text-sm text-[#A1887F]">Carregando clientes...</p>
          </div>
        )}
      </div>

      {/* Selected Customer Card */}
      {selectedCustomer && (
        <div className="bg-[#A1887F] rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-[#C49A9A] flex items-center justify-center flex-shrink-0">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-semibold text-[#E0DCD1] mb-1">
                {selectedCustomer.full_name}
              </h4>
              {selectedCustomer.email && (
                <p className="text-sm text-[#E0DCD1]/70 mb-1">
                  {selectedCustomer.email}
                </p>
              )}
              {selectedCustomer.whatsapp && (
                <p className="text-sm text-[#E0DCD1]/70 flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {formatWhatsApp(selectedCustomer.whatsapp)}
                </p>
              )}
            </div>
            <button
              onClick={() => setOpen(true)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-[#E0DCD1] text-sm font-medium rounded-lg transition-colors"
            >
              Alterar
            </button>
          </div>
        </div>
      )}

      {/* Next Button */}
      <div className="pt-4">
        <button
          onClick={handleNext}
          disabled={!canGoToStep(2)}
          className="w-full bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px]"
        >
          Próximo
        </button>
      </div>

      {/* Add Customer Modal */}
      <AddCustomerModal
        open={isAddCustomerOpen}
        onOpenChange={setIsAddCustomerOpen}
        onCustomerCreated={handleCustomerCreated}
      />
    </div>
  )
}
