import React from 'react'
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Search,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";




export default function AddProducts({category, otherProducts,setIsAddProductDialogOpen,fetchData}:any) {
    const [productSearchTerm, setProductSearchTerm] = useState("");
    const [selectedProductsToAdd, setSelectedProductsToAdd] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);



    const filteredOtherProducts = otherProducts.filter(
      (product:any) =>
        product?.name?.toLowerCase().includes(productSearchTerm.toLowerCase()) 
    );

    

        
    const handleSelectProductToAdd = (productId: string) => {
      setSelectedProductsToAdd((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );
    };

    const handleAddExistingProducts = async () => {
        setIsLoading(true)
        console.log(
          `Adding products ${selectedProductsToAdd.join(", ")} to category ${
            category?.name
          }`
        );

        try {
            const res = await axios.post("/api/Category/addProducts", {
              products:selectedProductsToAdd,
              category:category.name
            })
            console.log(res)
            if(res.status === 200) {
                fetchData()
                setIsAddProductDialogOpen(false);
                setSelectedProductsToAdd([]);
                setProductSearchTerm("");
            }
        } catch (error:any) {
            console.log(error.response.data.message)
        }finally{
            setIsLoading(false)
        }
      
    };
    
    return (
      <DialogContent className="w-full max-w-[90vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Product to "{category.name}"</DialogTitle>
            <DialogDescription>
              Add existing products or create a new one for this
              category.
            </DialogDescription>    
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Option 1: Add Existing Product */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">
                Add Existing Product(s)
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products to add..."
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="max-h-60 overflow-y-auto border rounded-md p-2 space-y-1">
                {filteredOtherProducts.length > 0 ? (
                  filteredOtherProducts.map((product:any) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                      onClick={() =>
                        handleSelectProductToAdd(product.id)
                      }
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedProductsToAdd.includes(
                            product.id
                          )}
                          onClick={() =>
                            handleSelectProductToAdd(product.id)
                          }
                          onChange={() =>
                            handleSelectProductToAdd(product.id)
                          }
                          className="form-checkbox h-4 w-4 cursor-pointer text-blue-600 rounded"
                        />
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={""}
                          className="w-8 h-8 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {product.name}
                          </p>

                        </div>
                      </div>
                      <Badge variant="outline">
                        {product.category || "none"}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    No other products found.
                  </p>
                )}
              </div>
              <Button
                onClick={handleAddExistingProducts}
                disabled={selectedProductsToAdd.length === 0 || isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {
                    isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />:
                    `Add Selected Products (${selectedProductsToAdd.length})`
                }
              </Button>
            </div>
            <Separator />
            {/* Option 2: Create New Product */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">
                Create New Product
              </h3>
              <p className="text-sm text-gray-600">
                Create a brand new product and automatically assign it
                to this category.
              </p>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  disabled={isLoading}
                  onClick={() => (window.location.href = "/dashboard/products/new?categoryId=" + category.id)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Product
                </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              disabled={isLoading}
              onClick={() => setIsAddProductDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
      </DialogContent>
    )
}