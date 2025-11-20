class Tamagotchi {
    constructor() {
        this.TIME_SETTINGS = {
            HUNGER_RATE: 2,
            HUNGER_NEEDY: 6,
            SLEEPINESS_RATE: 3,
            SLEEPINESS_NEEDY: 7,
            SLEEP_DURATION: 0.5,
            BOREDOM_RATE: 4,
            BOREDOM_NEEDY: 6,
            AGE_RATE: 10,
            OFFLINE_HUNGER: 0.3,
            OFFLINE_SLEEPINESS: 0.2,
            OFFLINE_BOREDOM: 0.25,
            OFFLINE_AGE: 0.05
        };

        this.IMAGES = {
            stages: [
                'images/tamagotchi/baby.png',   
                'images/tamagotchi/child.png',  
                'images/tamagotchi/teen.png',   
                'images/tamagotchi/adult.png',  
                'images/tamagotchi/old.png',    
                'images/tamagotchi/olded.png'   
            ],
            
            states: {
                HUNGRY: 'images/tamagotchi/hungry.png',
                SLEEPY: 'images/tamagotchi/sleepy.png',
                BORED: 'images/tamagotchi/bored.png',
                DEAD: 'images/tamagotchi/dead.png',
                SLEEPING: 'images/tamagotchi/sleeping.gif',
                EATING: 'images/tamagotchi/eating.gif',
                PLAYING: 'images/tamagotchi/playing.gif'
            },
            
            default: 'images/tamagotchi/adult.png'
        };

        this.hunger = 5;
        this.sleepiness = 5;
        this.boredom = 5;
        this.age = 0;
        this.isAlive = true;
        this.isSleeping = false;
        this.ageStages = ['Малыш', 'Ребенок', 'Подросток', 'Взрослый', 'Старик', 'Старик'];
        this.currentStage = 0;
        this.sleepTimer = null;
        this.lastUpdateTime = Date.now();
        this.isGameActive = true;
        this.currentAction = null;
        
        this.loadFromStorage();
        this.init();
    }

    init() {
        this.updateDisplay();
        
        setInterval(() => {
            if (this.isGameActive) {
                this.update();
            }
        }, 1000);

        window.addEventListener('beforeunload', () => {
            this.saveToStorage();
        });

        setInterval(() => {
            this.saveToStorage();
        }, 30000); 
            this.initPetClick();
    }

    initPetClick() {
        const pet = document.getElementById('pet');
        pet.addEventListener('click', () => {
            this.handlePetClick();
        });
    }

    handlePetClick() {
        if (!this.isAlive) {
            this.showMessage('💀 Питомец не реагирует...');
            return;
        }

        if (this.isSleeping) {
            this.showMessage('💤 Не буди меня... Zzz...');
            this.animateSleepyReaction();
            return;
        }

        const age = Math.floor(this.age);
        let message = '';

        if (age < 1) {
            message = '👶 Кто это тут трогает?';
            this.animateConfused();
        } else if (age < 3) {
            message = '😠 Не трогай меня ><';
            this.animateAngry();
        } else if (age < 7) {
            message = '😒 Опять ты...';
            this.animateAnnoyed();
        } else if (age < 14) {
            message = '😐 Можно я поиграю один?';
            this.animateNeutral();
        } else if (age < 21) {
            message = '🙂 Ладно, погладь...';
            this.animateHappy();
        } else if (age < 30) {
            message = '😊 Это приятно... (//////)';
            this.animateBlush();
        } else if (age < 45) {
            message = '🥰 Люблю, когда ты меня гладишь!';
            this.animateLove();
        } else if (age < 60) {
            message = '😍 Ты лучший хозяин!';
            this.animateExcited();
        } else if (age < 80) {
            message = '🤗 Обнимашки! Спасибо, что заботишься обо мне!';
            this.animateHug();
        } else {
            message = '👴 В моем возрасте приятно, что обо мне помнят...';
            this.animateNostalgic();
        }

        this.showMessage(message);
        
        if (age > 7) {
            this.boredom = Math.max(0, this.boredom - 0.5);
        }
    }

    animateHappy() {
        const pet = document.getElementById('pet');
        pet.classList.add('happy');
        this.createHearts(3);
        setTimeout(() => pet.classList.remove('happy'), 800);
    }

    animateLove() {
        const pet = document.getElementById('pet');
        pet.classList.add('sparkle');
        this.createHearts(5);
        setTimeout(() => pet.classList.remove('sparkle'), 1000);
    }

    animateAngry() {
        const pet = document.getElementById('pet');
        pet.classList.add('vibrate');
        setTimeout(() => pet.classList.remove('vibrate'), 300);
    }

    animateBlush() {
        const pet = document.getElementById('pet');
        pet.style.filter = 'hue-rotate(300deg)';
        setTimeout(() => pet.style.filter = '', 1000);
    }

    animateExcited() {
        const pet = document.getElementById('pet');
        pet.classList.add('happy');
        this.createHearts(8);
        setTimeout(() => pet.classList.remove('happy'), 800);
    }

    animateHug() {
        const pet = document.getElementById('pet');
        pet.style.transform = 'scale(1.2)';
        this.createHearts(6);
        setTimeout(() => pet.style.transform = '', 600);
    }

    animateSleepyReaction() {
        const pet = document.getElementById('pet');
        pet.style.opacity = '0.7';
        setTimeout(() => pet.style.opacity = '', 500);
    }

    animateConfused() {
        const pet = document.getElementById('pet');
        pet.style.transform = 'rotate(10deg)';
        setTimeout(() => pet.style.transform = 'rotate(-10deg)', 200);
        setTimeout(() => pet.style.transform = '', 400);
    }

    animateAnnoyed() {
        const pet = document.getElementById('pet');
        pet.style.transform = 'scale(0.9)';
        setTimeout(() => pet.style.transform = '', 300);
    }

    animateNeutral() {
        const pet = document.getElementById('pet');
        pet.style.transform = 'scale(1.02)';
        setTimeout(() => pet.style.transform = '', 200);
    }

    animateNostalgic() {
        const pet = document.getElementById('pet');
        pet.style.filter = 'sepia(0.5)';
        this.createHearts(2);
        setTimeout(() => pet.style.filter = '', 1500);
    }

    createHearts(count) {
        const petContainer = document.querySelector('.pet-container');
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'heart';
                heart.textContent = '❤️';
                heart.style.left = Math.random() * 100 + 'px';
                heart.style.top = Math.random() * 100 + 'px';
                
                petContainer.appendChild(heart);
                
                setTimeout(() => {
                    if (heart.parentNode) {
                        heart.parentNode.removeChild(heart);
                    }
                }, 1500);
            }, i * 200);
        }
    }

    showMessage(text) {
        const messageElement = document.getElementById('message');
        messageElement.textContent = text;
        messageElement.classList.add('bounce-text');
        setTimeout(() => messageElement.classList.remove('bounce-text'), 500);
    }

    loadFromStorage() {
        const saved = localStorage.getItem('tamagotchiData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                const currentTime = Date.now();
                const timeDiff = (currentTime - data.lastUpdateTime) / 1000;
                
                this.hunger = data.hunger;
                this.sleepiness = data.sleepiness;
                this.boredom = data.boredom;
                this.age = data.age;
                this.isAlive = data.isAlive;
                this.isSleeping = data.isSleeping;
                this.currentStage = data.currentStage;
                this.lastUpdateTime = data.lastUpdateTime;

                if (this.isAlive && !this.isSleeping && timeDiff > 10) {
                    this.calculateOfflineChanges(timeDiff);
                }

                console.log('Данные загружены. Прошло времени:', Math.floor(timeDiff), 'секунд');
            } catch (e) {
                console.log('Не удалось загрузить данные, начинаем новую игру');
            }
        }
    }

    calculateOfflineChanges(timeDiff) {
        const hoursPassed = timeDiff / 3600;
        
        this.hunger = Math.min(10, this.hunger + (hoursPassed * 0.5));
        this.sleepiness = Math.min(10, this.sleepiness + (hoursPassed * 0.3));
        this.boredom = Math.min(10, this.boredom + (hoursPassed * 0.4));
        
        this.age = Math.min(100, this.age + (hoursPassed * 0.1));
        
        this.updateAgeStage();
        this.checkDeath();
    }

    saveToStorage() {
        const data = {
            hunger: this.hunger,
            sleepiness: this.sleepiness,
            boredom: this.boredom,
            age: this.age,
            isAlive: this.isAlive,
            isSleeping: this.isSleeping,
            currentStage: this.currentStage,
            lastUpdateTime: Date.now(),
            saveTime: new Date().toLocaleString('ru-RU')
        };
        
        localStorage.setItem('tamagotchiData', JSON.stringify(data));
        console.log('Данные сохранены:', data.saveTime);
    }

    resetGame() {
        if (confirm('Начать новую игру? Текущий питомец будет потерян!')) {
            if (this.sleepTimer) {
                clearTimeout(this.sleepTimer);
            }
            
            this.hunger = 5;
            this.sleepiness = 5;
            this.boredom = 5;
            this.age = 0;
            this.isAlive = true;
            this.isSleeping = false;
            this.currentStage = 0;
            this.currentAction = null;
            this.lastUpdateTime = Date.now();
            
            localStorage.removeItem('tamagotchiData');
            
            this.updateDisplay();
            this.showMessage('🎮 Начата новая игра! Заботьтесь о новом питомце!');
            
            console.log('Новая игра начата');
        }
    }

    update() {
        if (!this.isAlive) return;

        const currentTime = Date.now();
        const timeDiff = (currentTime - this.lastUpdateTime) / 1000; 
        this.lastUpdateTime = currentTime;

        const hungerPerSecond = (1 / (this.TIME_SETTINGS.HUNGER_RATE * 60));
        const sleepinessPerSecond = (1 / (this.TIME_SETTINGS.SLEEPINESS_RATE * 60));
        const boredomPerSecond = (1 / (this.TIME_SETTINGS.BOREDOM_RATE * 60));
        const agePerSecond = (1 / (this.TIME_SETTINGS.AGE_RATE * 60));

        if (!this.isSleeping) {
            this.hunger = Math.min(10, this.hunger + (hungerPerSecond * timeDiff));
            this.boredom = Math.min(10, this.boredom + (boredomPerSecond * timeDiff));
        }
        
        this.sleepiness = Math.min(10, this.sleepiness + (sleepinessPerSecond * timeDiff));
        
        if (this.age < 100) {
            this.age += (agePerSecond * timeDiff);
        }

        this.updateAgeStage();
        this.checkDeath();
        this.updateDisplay();
        this.checkNeeds();

        if (Math.floor(this.hunger) !== Math.floor(this.hunger - (hungerPerSecond * timeDiff)) ||
            Math.floor(this.age) !== Math.floor(this.age - (agePerSecond * timeDiff))) {
            this.saveToStorage();
        }
    }

    checkNeeds() {
        if (!this.isAlive || this.isSleeping) return;

        if (this.hunger > 6) {
            this.showMessage('🥺 Я голоден! Покорми меня!');
        } else if (this.boredom > 6) {
            this.showMessage('😞 Мне скучно! Поиграй со мной!');
        } else if (this.sleepiness > 7 && !this.isSleeping) {
            this.showMessage('😴 Я хочу спать...');
        }
    }

    feed() {
        if (!this.isAlive || this.isSleeping) return;
        this.hunger = Math.max(0, this.hunger - 3);
        this.showMessage('Ням-ням! Вкусно!');
        this.animateAction('eating');
        this.saveToStorage();
    }

    putToSleep() {
        if (!this.isAlive || this.isSleeping) return;
        
        this.isSleeping = true;
        this.showMessage('Zzz... Питомец спит...');
        this.animateAction('sleeping');
        
        this.sleepTimer = setTimeout(() => {
            this.wakeUp();
        }, 10000); 
        
        this.saveToStorage();
    }

    wakeUp() {
        this.isSleeping = false;
        this.sleepiness = Math.max(0, this.sleepiness - 5);
        this.showMessage('Проснулся! Отдохнувший и счастливый!');
        this.stopAnimation();
        this.saveToStorage();
    }

    play() {
        if (!this.isAlive || this.isSleeping) return;
        this.boredom = Math.max(0, this.boredom - 3);
        this.hunger = Math.min(10, this.hunger + 0.5);
        this.showMessage('Ура! Играем!');
        this.animateAction('playing');
        this.saveToStorage();
    }

    clean() {
        if (!this.isAlive || this.isSleeping) return;
        this.showMessage('Чисто и свежо! Спасибо!');
        this.saveToStorage();
    }

    updateAgeStage() {
        const stages = [0, 25, 50, 75];
        for (let i = stages.length - 1; i >= 0; i--) {
            if (this.age >= stages[i]) {
                this.currentStage = i;
                break;
            }
        }
    }



    checkDeath() {
        if ((this.hunger >= 10 || this.sleepiness >= 10 || this.boredom >= 10) && this.isAlive) {
            this.isAlive = false;
            this.isSleeping = false;
            this.currentAction = null;
            
            if (this.sleepTimer) {
                clearTimeout(this.sleepTimer);
                this.sleepTimer = null;
            }
            
            this.showMessage('💀 Ваш питомец умер... Нажмите "Новая игра" чтобы начать заново!');
            this.stopAnimation();
            this.saveToStorage();
        }
    }

    showMessage(text) {
        document.getElementById('message').textContent = text;
    }

    animateAction(action) {
        const pet = document.getElementById('pet');
        pet.className = 'pet';
        if (action) {
            pet.classList.add(action);
        }
    }

    stopAnimation() {
        const pet = document.getElementById('pet');
        pet.className = 'pet';
        if (!this.isAlive) {
            pet.classList.add('dead');
        }
    }

    updateDisplay() {
        document.getElementById('hunger').textContent = Math.floor(this.hunger);
        document.getElementById('sleepiness').textContent = Math.floor(this.sleepiness);
        document.getElementById('boredom').textContent = Math.floor(this.boredom);
        document.getElementById('age').textContent = Math.floor(this.age);

        document.getElementById('hungerBar').style.width = (this.hunger * 10) + '%';
        document.getElementById('sleepinessBar').style.width = (this.sleepiness * 10) + '%';
        document.getElementById('boredomBar').style.width = (this.boredom * 10) + '%';
        document.getElementById('ageBar').style.width = this.age + '%';

        document.getElementById('ageStage').textContent = this.ageStages[this.currentStage];

        this.updatePetImage();

        const buttons = document.querySelectorAll('.control-btn');
        buttons.forEach(btn => {
            btn.disabled = !this.isAlive || this.isSleeping;
        });

        this.updateSaveInfo();
    }

    updatePetImage() {
        const pet = document.getElementById('pet');
        let imageUrl = '';
        
        if (!this.isAlive) {
            imageUrl = this.IMAGES.states.DEAD;
        } else if (this.currentAction === 'eating') {
            imageUrl = this.IMAGES.states.EATING;
        } else if (this.currentAction === 'playing') {
            imageUrl = this.IMAGES.states.PLAYING;
        } else if (this.isSleeping) {
            imageUrl = this.IMAGES.states.SLEEPING;
        } else if (this.hunger > this.TIME_SETTINGS.HUNGER_NEEDY) {
            imageUrl = this.IMAGES.states.HUNGRY;
        } else if (this.boredom > this.TIME_SETTINGS.BOREDOM_NEEDY) {
            imageUrl = this.IMAGES.states.BORED;
        } else if (this.sleepiness > this.TIME_SETTINGS.SLEEPINESS_NEEDY) {
            imageUrl = this.IMAGES.states.SLEEPY;
        } else {
            const stageIndex = this.getAgeStageIndex();
            imageUrl = this.IMAGES.stages[stageIndex] || this.IMAGES.default;
        }
        
        pet.src = imageUrl;
        pet.alt = this.getImageAltText();
    }

    getAgeStageIndex() {
        const age = this.age;
        if (age < 10) return 0;   
        if (age < 25) return 1;   
        if (age < 40) return 2;   
        if (age < 60) return 3;   
        if (age < 85) return 4;   
        return 5;                 
    }

    getImageAltText() {
        if (!this.isAlive) return 'Мертвый питомец';
        if (this.currentAction === 'eating') return 'Питомец ест';
        if (this.currentAction === 'playing') return 'Питомец играет';
        if (this.isSleeping) return 'Питомец спит';
        if (this.hunger > this.TIME_SETTINGS.HUNGER_NEEDY) return 'Питомец голоден';
        if (this.boredom > this.TIME_SETTINGS.BOREDOM_NEEDY) return 'Питомцу скучно';
        if (this.sleepiness > this.TIME_SETTINGS.SLEEPINESS_NEEDY) return 'Питомец хочет спать';
        return this.ageStages[this.getAgeStageIndex()];
    }

    animateAction(action) {
        this.currentAction = action;
        const pet = document.getElementById('pet');
        pet.className = 'pet';
        
        if (action) {
            pet.classList.add(action);
            setTimeout(() => {
                if (this.currentAction === action) {
                    this.currentAction = null;
                    this.updatePetImage();
                }
            }, 2000);
        }
        
        this.updatePetImage();
    }

    stopAnimation() {
        this.currentAction = null;
        const pet = document.getElementById('pet');
        pet.className = 'pet';
        if (!this.isAlive) {
            pet.classList.add('dead');
        }
        this.updatePetImage();
    }

    updateSaveInfo() {
        const saved = localStorage.getItem('tamagotchiData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                const saveInfo = document.getElementById('saveInfo');
            } catch (e) {
                
            }
        }
    }

    debugState() {
        console.log('=== СОСТОЯНИЕ ТАМАГОЧИ ===');
        console.log('Жив:', this.isAlive);
        console.log('Спит:', this.isSleeping);
        console.log('Голод:', this.hunger);
        console.log('Сонливость:', this.sleepiness);
        console.log('Скука:', this.boredom);
        console.log('Возраст:', this.age);
        console.log('Стадия:', this.currentStage);
        console.log('Действие:', this.currentAction);
        console.log('Таймер сна:', this.sleepTimer);
        console.log('======================');
    }

}

function goBack() {
    if (confirm('Вернуться на главную? Игра продолжит сохраняться автоматически.')) {
        window.location.href = 'index.html';
    }
}

function resetGame() {
    tamagotchi.resetGame();
}

window.tamagotchi = new Tamagotchi();
const tamagotchi = window.tamagotchi;
