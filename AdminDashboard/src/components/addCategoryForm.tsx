"use client"

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from './ui/button';
import { Loader2, Plus } from 'lucide-react';
import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Textarea } from './ui/textarea';

export default function AddCategoryForm({loadCategory}:any) {
    const {register, handleSubmit,formState: { errors,isSubmitting }, setError} = useForm();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);


    const handleAddCategory = async(data:any) => {
        console.log(data)
        try {
          const res = await axios.post("/api/Category/create", data);
          if(res.status === 200){
              console.log(res)
          }
          if (loadCategory) loadCategory()
        } catch (error:any) {
          alert(error.response.data.message || `Something went wrong please try again \n${error.message}`);
        }finally{
          setIsAddDialogOpen(false)
        }
    };


  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new category to organize your products.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleAddCategory)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  required
                  {...register("name")}
                  placeholder="Enter category name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryDescription">Description</Label>
                <Textarea
                  id="categoryDescription"
                  {...register("description")}
                  required
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>
              <DialogFooter>
                <Button
                  disabled={isSubmitting}
                  variant="outline"
                  type='button'
                >
                  Cancel
                </Button>
                <Button disabled={isSubmitting}  className={`bg-blue-700 hover:bg-blue-700`}>
                  {
                    isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Add Category"
                  }
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
  )
}