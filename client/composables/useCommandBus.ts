import type { CommandMap, CommandType, ICommand } from "~/assets/models/commands";
import { CommandBus, type CommandHandler } from "~/assets/services/CommandBus";

const commandBus = new CommandBus();

export const useCommandBus = () => {
    return {
        registerHandler: <T extends CommandType>(commandType: T, handler: CommandHandler<CommandMap[T]>) => commandBus.registerHandler(commandType, handler),
        unregisterHandler: <T extends CommandType>(commandType: T, handler: CommandHandler<CommandMap[T]>) => commandBus.unregisterHandler(commandType, handler),
        executeCommand: (command: ICommand) => commandBus.executeCommand(command)
    }
}
