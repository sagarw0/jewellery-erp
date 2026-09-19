/**
 * Tool Schemas and Function Declarations for Swarna AI ERP Copilot
 * Fully compliant with Google Gemini API Function Calling & OpenAI Tool Call format.
 */

export interface FunctionParameterSchema {
  type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
  description?: string;
  enum?: string[];
  items?: FunctionParameterSchema;
  properties?: Record<string, FunctionParameterSchema>;
  required?: string[];
}

export interface FunctionDeclaration {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, FunctionParameterSchema>;
    required?: string[];
  };
}

export interface ToolDefinition {
  type: 'function';
  function: FunctionDeclaration;
}

// ============================================================================
// 1. query_sales_data
// ============================================================================
export const QUERY_SALES_DATA_SCHEMA: FunctionDeclaration = {
  name: 'query_sales_data',
  description: 'Evaluates sales inquiries, performs arithmetic & financial aggregations (totals, gross margins, average order value, GST breakdown, item counts), and returns structured tabular sales data with analytics summaries.',
  parameters: {
    type: 'object',
    properties: {
      date_range: {
        type: 'string',
        description: 'Time window for sales: "today", "yesterday", "this_week", "last_week", "this_month", "last_month", "all_time", or specific date "YYYY-MM-DD"',
        enum: ['today', 'yesterday', 'this_week', 'last_week', 'this_month', 'last_month', 'all_time']
      },
      category: {
        type: 'string',
        description: 'Filter by jewellery product category: "Gold", "Silver", "Diamond", "Platinum", "Imitation", or "All"',
        enum: ['Gold', 'Silver', 'Diamond', 'Platinum', 'Imitation', 'All']
      },
      payment_mode: {
        type: 'string',
        description: 'Filter by settlement method: "Cash", "UPI", "Card", "NEFT/RTGS", "Split", "Old Gold Exchange", or "All"',
        enum: ['Cash', 'UPI', 'Card', 'NEFT/RTGS', 'Split', 'Old Gold Exchange', 'All']
      },
      min_amount: {
        type: 'number',
        description: 'Minimum transaction invoice amount in INR'
      },
      max_amount: {
        type: 'number',
        description: 'Maximum transaction invoice amount in INR'
      },
      salesman: {
        type: 'string',
        description: 'Filter by staff salesman name or employee code'
      },
      calculations: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['total_revenue', 'gross_margin', 'average_order_value', 'item_count', 'tax_total', 'metal_weight_sold']
        },
        description: 'Specific arithmetic metrics to aggregate and display in summary cards'
      },
      group_by: {
        type: 'string',
        description: 'Dimension to group aggregated rows by: "category", "payment_mode", "date", "salesman"',
        enum: ['category', 'payment_mode', 'date', 'salesman']
      }
    },
    required: []
  }
};

// ============================================================================
// 2. search_vendor
// ============================================================================
export const SEARCH_VENDOR_SCHEMA: FunctionDeclaration = {
  name: 'search_vendor',
  description: 'Looks up bullion suppliers, manufacturers, casting units, and jewellery vendors matching partial criteria (name, contact phone, city, category, GSTIN, credit status, or metal balance).',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search string matching vendor name, contact person, phone number, GSTIN, or city (e.g. "Rajesh", "Zaveri", "9820", "Bullion")'
      },
      category: {
        type: 'string',
        description: 'Vendor classification filter',
        enum: ['Bullion Dealer', 'Manufacturer', 'Casting Unit', 'Diamond Merchant', 'Silver Artisan', 'All']
      },
      has_balance: {
        type: 'boolean',
        description: 'If true, filter only vendors with outstanding metal/cash balances'
      },
      fields: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['vendor_name', 'contact_person', 'phone', 'category', 'city', 'gstin', 'cash_balance', 'metal_balance', 'status']
        },
        description: 'Specific fields to return in the directory report'
      }
    },
    required: ['query']
  }
};

// ============================================================================
// 3. lookup_order
// ============================================================================
export const LOOKUP_ORDER_SCHEMA: FunctionDeclaration = {
  name: 'lookup_order',
  description: 'Retrieves custom customer bridal & jewellery order details, workshop stage progress, Karagir job cards, promised delivery dates, and pending balance amounts.',
  parameters: {
    type: 'object',
    properties: {
      order_id: {
        type: 'string',
        description: 'Order ID or booking reference number (e.g. "ORD-2026-108", "904", "108")'
      },
      status: {
        type: 'string',
        description: 'Filter orders by workflow status',
        enum: ['Booked', 'In Workshop', 'Casting Completed', 'Stone Setting', 'Polishing', 'Ready', 'Delivered', 'Cancelled', 'All']
      },
      customer_id: {
        type: 'string',
        description: 'Customer account ID, customer name, or mobile phone number'
      },
      date_range: {
        type: 'string',
        description: 'Delivery due time filter: "today", "this_week", "overdue", "all"',
        enum: ['today', 'this_week', 'overdue', 'all']
      },
      karagir_name: {
        type: 'string',
        description: 'Filter orders assigned to a specific Karagir or goldsmith workshop'
      }
    },
    required: []
  }
};

// ============================================================================
// 4. navigate_ui
// ============================================================================
export const NAVIGATE_UI_SCHEMA: FunctionDeclaration = {
  name: 'navigate_ui',
  description: 'Emits direct client-side programmatic navigation events to redirect the user to specific application screens, modules, or views inside Swarna ERP.',
  parameters: {
    type: 'object',
    properties: {
      route_name: {
        type: 'string',
        description: 'Destination ERP section identifier',
        enum: [
          'dashboard',
          'sales_invoice',
          'purchase',
          'barcode',
          'item_creation',
          'new_order',
          'refinery_in',
          'account_master',
          'vendor_master',
          'karagir_master',
          'day_book',
          'stock_report',
          'account_display',
          'book_display',
          'gold_scheme',
          'messenger',
          'backup',
          'settings',
          'field_dictionary'
        ]
      },
      params: {
        type: 'object',
        properties: {
          subView: { type: 'string', description: 'Specific tab or sub-view inside the module' },
          filter: { type: 'string', description: 'Initial filter or search keyword to apply on the target screen' },
          id: { type: 'string', description: 'Entity record ID to focus on' }
        },
        description: 'Optional navigation parameters and deep-linking arguments'
      },
      confirmation_message: {
        type: 'string',
        description: 'User-facing confirmation message explaining where they are being redirected'
      }
    },
    required: ['route_name']
  }
};

// ============================================================================
// Array of all Tools for LLM Function Calling Registration
// ============================================================================
export const ERP_TOOL_DECLARATIONS: FunctionDeclaration[] = [
  QUERY_SALES_DATA_SCHEMA,
  SEARCH_VENDOR_SCHEMA,
  LOOKUP_ORDER_SCHEMA,
  NAVIGATE_UI_SCHEMA,
];

export const ERP_TOOLS: ToolDefinition[] = ERP_TOOL_DECLARATIONS.map((fn) => ({
  type: 'function',
  function: fn,
}));
