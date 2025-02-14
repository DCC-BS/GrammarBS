import type { CommandMap, CommandType, ICommand } from "~/assets/models/commands";
import { CommandBus, type CommandHandler } from "~/assets/services/CommandBus";

const commandBus = new CommandBus();

/**
 * Provides methods to interact with the command bus.
 *
 * @returns An object containing methods to register, unregister, and execute commands.
 */
export const useCommandBus = () => {
    return {
        /**
         * Registers a handler for a specific command type.
         *
         * @param commandType - The type of command to handle.
         * @param handler - The handler function to execute when the command is received.
         */
        registerHandler: <T extends CommandType>(commandType: T, handler: CommandHandler<CommandMap[T]>) => commandBus.registerHandler(commandType, handler),

        /**
         * Unregisters a handler for a specific command type.
         *
         * @param commandType - The type of command to stop handling.
         * @param handler - The handler function to remove.
         */
        unregisterHandler: <T extends CommandType>(commandType: T, handler: CommandHandler<CommandMap[T]>) => commandBus.unregisterHandler(commandType, handler),

        /**
         * Executes all handlers registered for the given command.
         *
         * @param command - The command to execute.
         */
        executeCommand: (command: ICommand) => commandBus.executeCommand(command)
    }
}
