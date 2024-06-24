import { setWorldConstructor } from '@cucumber/cucumber';

class CustomWorld {
  [key: string]: any;
}

setWorldConstructor(CustomWorld);
