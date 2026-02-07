import React, { useState, useMemo } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { StatCard } from './StatCard';
import { getTasks, categoryIcons, type Task } from './data/taskData';
import './CareTasks.css';

const categoryLabels: Record<string, string> = {
    vitals: 'Vitals',
    exercise: 'Exercise',
    diet: 'Diet',
    hygiene: 'Hygiene',
    medication: 'Med Support'
};

export const CareTasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(() => getTasks());
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const [formData, setFormData] = useState({
        title: '',
        category: 'vitals' as Task['category'],
        dueDate: new Date().toISOString().split('T')[0],
        dueTime: '09:00',
        repeat: 'none' as Task['repeat'],
        notes: ''
    });

    const stats = useMemo(() => {
        const pending = tasks.filter(t => t.status === 'pending').length;
        const completed = tasks.filter(t => t.status === 'completed').length;
        const overdue = tasks.filter(t => t.status === 'overdue').length;
        const completionRate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
        return { pending, completed, overdue, completionRate };
    }, [tasks]);

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [tasks, searchTerm, statusFilter]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) return;

        const newTask: Task = {
            id: Date.now().toString(),
            ...formData,
            status: 'pending'
        };

        setTasks([newTask, ...tasks]);
        setFormData({
            title: '',
            category: 'vitals',
            dueDate: new Date().toISOString().split('T')[0],
            dueTime: '09:00',
            repeat: 'none',
            notes: ''
        });
        setShowForm(false);
    };

    const markComplete = (id: string) => {
        setTasks(tasks.map(t =>
            t.id === id ? { ...t, status: 'completed', completedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) } : t
        ));
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    };
    const getStatusColor = (status: string) => {
        if (status === 'completed') return 'green';
        if (status === 'overdue') return 'pink';
        return 'yellow';
    };

    const analytics = useMemo(() => {
        const categoryCount: Record<string, { total: number; missed: number }> = {};

        tasks.forEach(task => {
            if (!categoryCount[task.category]) {
                categoryCount[task.category] = { total: 0, missed: 0 };
            }
            categoryCount[task.category].total++;
            if (task.status === 'overdue') {
                categoryCount[task.category].missed++;
            }
        });

        let mostMissed = '';
        let maxMissed = 0;
        Object.entries(categoryCount).forEach(([cat, data]) => {
            if (data.missed > maxMissed) {
                maxMissed = data.missed;
                mostMissed = cat;
            }
        });

        return { categoryCount, mostMissed };
    }, [tasks]);

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="care-tasks">

            <header className="care-tasks__header">
                <div className="care-tasks__header-left">
                    <h1 className="care-tasks__title">Care Tasks</h1>
                    <span className="care-tasks__date">{currentDate}</span>
                </div>
                <Button variant="primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? '✕ Close' : '+ Add Task'}
                </Button>
            </header>

            <section className="care-tasks__stats">
                <StatCard
                    title="Task Overview"
                    color="white"
                    stats={[
                        { label: 'Pending', value: stats.pending },
                        { label: 'Completed', value: stats.completed },
                        { label: 'Overdue', value: stats.overdue }
                    ]}
                />
            </section>

            {showForm && (
                <section className="care-tasks__form-section">
                    <Card color="blue" padding="large">
                        <h2 className="care-tasks__section-title">Create New Task</h2>
                        <form onSubmit={handleSubmit} className="care-tasks__form">
                            <div className="care-tasks__form-row">
                                <div className="care-tasks__form-group care-tasks__form-group--large">
                                    <label className="care-tasks__label">Task Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="care-tasks__input"
                                        placeholder="e.g., BP Check, Physio Exercise"
                                        required
                                    />
                                </div>
                                <div className="care-tasks__form-group">
                                    <label className="care-tasks__label">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as Task['category'] })}
                                        className="care-tasks__select"
                                    >
                                        <option value="vitals">🩺 Vitals</option>
                                        <option value="exercise">🏃 Exercise</option>
                                        <option value="diet">🥗 Diet</option>
                                        <option value="hygiene">🧼 Hygiene</option>
                                        <option value="medication">💊 Medication Support</option>
                                    </select>
                                </div>
                            </div>

                            <div className="care-tasks__form-row">
                                <div className="care-tasks__form-group">
                                    <label className="care-tasks__label">Due Date</label>
                                    <input
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        className="care-tasks__input"
                                    />
                                </div>
                                <div className="care-tasks__form-group">
                                    <label className="care-tasks__label">Due Time</label>
                                    <input
                                        type="time"
                                        value={formData.dueTime}
                                        onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                                        className="care-tasks__input"
                                    />
                                </div>
                                <div className="care-tasks__form-group">
                                    <label className="care-tasks__label">Repeat</label>
                                    <select
                                        value={formData.repeat}
                                        onChange={(e) => setFormData({ ...formData, repeat: e.target.value as Task['repeat'] })}
                                        className="care-tasks__select"
                                    >
                                        <option value="none">No Repeat</option>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                    </select>
                                </div>
                            </div>

                            <div className="care-tasks__form-group care-tasks__form-group--full">
                                <label className="care-tasks__label">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="care-tasks__textarea"
                                    placeholder="Extra instructions or precautions..."
                                    rows={2}
                                />
                            </div>

                            <Button variant="primary" type="submit">Create Task</Button>
                        </form>
                    </Card>
                </section>
            )}
            <section className="care-tasks__filters">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="care-tasks__search"
                    placeholder="Search tasks..."
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="care-tasks__filter-select"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                </select>
            </section>
            <section className="care-tasks__list">
                <Card color="white" padding="large">
                    <h2 className="care-tasks__section-title">Task List ({filteredTasks.length})</h2>
                    {filteredTasks.length === 0 ? (
                        <p className="care-tasks__empty">No tasks found</p>
                    ) : (
                        <div className="care-tasks__cards">
                            {filteredTasks.map(task => (
                                <div key={task.id} className={`care-tasks__card care-tasks__card--${task.status}`}>
                                    <div className="care-tasks__card-header">
                                        <div className="care-tasks__card-title-row">
                                            <span className="care-tasks__category-icon">{categoryIcons[task.category]}</span>
                                            <h3 className="care-tasks__card-title">{task.title}</h3>
                                        </div>
                                        <Badge variant={getStatusColor(task.status)} size="small">
                                            {task.status === 'completed' ? 'Completed' : task.status === 'overdue' ? 'Overdue' : 'Pending'}
                                        </Badge>
                                    </div>
                                    <div className="care-tasks__card-details">
                                        <div className="care-tasks__card-row">
                                            <span className="care-tasks__card-label">Category:</span>
                                            <span>{categoryLabels[task.category]}</span>
                                        </div>
                                        <div className="care-tasks__card-row">
                                            <span className="care-tasks__card-label">Due:</span>
                                            <span>{task.dueTime} {task.repeat !== 'none' && `(${task.repeat})`}</span>
                                        </div>
                                        {task.notes && (
                                            <div className="care-tasks__card-notes">
                                                <span className="care-tasks__card-label">Notes:</span>
                                                <span>{task.notes}</span>
                                            </div>
                                        )}
                                        {task.completedAt && (
                                            <div className="care-tasks__card-row">
                                                <span className="care-tasks__card-label">Completed:</span>
                                                <span>{task.completedAt}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="care-tasks__card-actions">
                                        {task.status !== 'completed' && (
                                            <button className="care-tasks__action-btn care-tasks__action-btn--complete" onClick={() => markComplete(task.id)}>
                                                ✓ Complete
                                            </button>
                                        )}
                                        <button className="care-tasks__action-btn care-tasks__action-btn--delete" onClick={() => deleteTask(task.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </section>
            <section className="care-tasks__analytics">
                <Card color="green" padding="large">
                    <h2 className="care-tasks__section-title">Analytics</h2>
                    <div className="care-tasks__analytics-grid">
                        <div className="care-tasks__analytics-item">
                            <span className="care-tasks__analytics-value">{stats.completionRate}%</span>
                            <span className="care-tasks__analytics-label">Completion Rate</span>
                        </div>
                        <div className="care-tasks__analytics-item">
                            <span className="care-tasks__analytics-value">
                                {analytics.mostMissed ? `${categoryIcons[analytics.mostMissed]} ${categoryLabels[analytics.mostMissed]}` : 'None'}
                            </span>
                            <span className="care-tasks__analytics-label">Most Missed Category</span>
                        </div>
                    </div>
                </Card>
            </section>
        </div>
    );
};
