import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      const response = await api.get('/foods');

      setFoods(response.data);
    }

    loadFoods();
  }, [setFoods]);

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      const response = await api.post('/foods', {
        available: true, ...food
      });

      setFoods([...foods, response.data]);

    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      console.log('dentro', editingFood);

      const response = await api.put(`/foods/${editingFood.id}`, {
        available: editingFood.available,
        id: editingFood.id,
        ...food
      });

      const updatedFoods = foods.map(currFood => {
        return (currFood.id !== editingFood.id ?
          currFood :
          response.data
        )
      });

      setFoods([...updatedFoods]);
      setEditingFood({} as IFoodPlate);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateAvailability(
    id: number, available: boolean,
  ): Promise<void> {
    try {
      await api.patch(`/foods/${id}`, {
        available,
      });

      const updatedFoods = foods.map(food => {
        return (food.id !== id ?
           food :
           {...food, available}
        )
      });

      setFoods([...updatedFoods]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number): Promise<void> {
    await api.delete(`/foods/${id}`);

    const updatedFoods = foods.filter(food => food.id !== id);

    setFoods([...updatedFoods]);
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    setEditingFood(food);
    toggleEditModal();
  }

  function handleEditAvailability(id: number, available: boolean): void {
    handleUpdateAvailability(id, available);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
              handleEditAvailability={handleEditAvailability}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
