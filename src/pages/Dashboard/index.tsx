import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food, { IFood } from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export default function Dashboard () {
  const [foods, setFoods] = useState<IFood[]>([]);
  const [editingFood, setEditingFood] = useState<IFood>({} as IFood);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    api.get('/foods')
    .then(response => setFoods(response.data));
  }, [])

  async function handleAddFood (food: IFood) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods(prev => [...prev, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood (food: IFood) {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, { ...editingFood, ...food});
      const foodsUpdated = foods.map(f => f.id !== foodUpdated.data.id ? f : foodUpdated.data);
      setFoods(foodsUpdated);
    } catch(err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);
    const foodsFiltered = foods.filter(food => food.id !== id);
    setFoods(foodsFiltered);
  }

  function toggleModal () {
    setIsModalOpen(prev => !prev);
  }

  function toggleEditModal () {
    setIsEditModalOpen(prev => !prev);
  }

  function handleEditFood (food: IFood) {
    setEditingFood(food);
    setIsEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={isModalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={isEditModalOpen}
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
            />
          ))}
      </FoodsContainer>
    </>
  );
}